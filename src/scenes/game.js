/*jslint sloppy: true */
/*globals Arcadia, TitleScene, Grid, LEVELS, window, console, localStorage, sona */

var GameScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    var self = this;

    sona.loop('bgm-tutorial');

    this.puzzleIndex = options.level;
    if (this.puzzleIndex === undefined) {
        this.puzzleIndex = 30;
    }
    this.puzzle = LEVELS[this.puzzleIndex];
    this.clues = this.puzzle.clues;
    this.secondsLeft = 1739; // ~ 29 * 60

    if (this.puzzle.difficulty === 'random') {
        this.clues = this.generateRandomPuzzle(this.puzzle.title);
    }

    this.action = GameScene.MARK;
    this.puzzleSize = Math.sqrt(this.clues.length);
    this.state = Array(this.clues.length);

    this.puzzleGrid = new Grid({
        size: Math.sqrt(this.clues.length),
        clues: this.clues,
        position: {
            x: 0,
            y: this.size.height / 2 - Grid.MAX_SIZE / 2 - 140
        }
    });
    this.add(this.puzzleGrid);

    this.filledBlocks = new Arcadia.Pool();
    this.filledBlocks.factory = function () {
        return new Block({ type: 'fill' });
    };
    this.add(this.filledBlocks);

    // Pre-instantiate some of these objects
    while (this.filledBlocks.length < 50) {
        this.filledBlocks.activate();
    }
    this.filledBlocks.deactivateAll();

    this.markedBlocks = new Arcadia.Pool();
    this.markedBlocks.factory = function () {
        return new Block({ type: 'mark' });
    };
    this.add(this.markedBlocks);

    while (this.markedBlocks.length < 50) {
        this.markedBlocks.activate();
    }
    this.markedBlocks.deactivateAll();

    var timerBackground = new Arcadia.Shape({
        size: { width: 340, height: 270 },
        position: { x: -185, y: -390 },
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(timerBackground);

    var timeLeftLabel = new Arcadia.Label({
        position: { x: 0, y: 90 },
        text: 'time left',
        color: 'black',
        font: '48px uni_05_53'
    });
    timerBackground.add(timeLeftLabel);

    this.timerLabel = new Arcadia.Label({
        position: { x: 0, y: -45 },
        text: '30:00',
        color: 'black',
        font: '88px uni_05_53'
    });
    timerBackground.add(this.timerLabel);

    var previewBackground = new Arcadia.Shape({
        size: { width: 340, height: 270 },
        position: { x: 185, y: -390 },
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(previewBackground);

    var previewLabel = new Arcadia.Label({
        position: { x: 0, y: -110 },
        text: 'preview',
        color: 'black',
        font: '48px uni_05_53'
    });
    previewBackground.add(previewLabel);

    this.preview = new Preview({
        position: { x: 0, y: 20 }
    });
    previewBackground.add(this.preview);

    this.setupButtons();
};

GameScene.prototype = new Arcadia.Scene();

GameScene.FILL = 'fill';
GameScene.MARK = 'mark';

GameScene.prototype.update = function (delta) {
    var minutes,
        seconds;

    Arcadia.Scene.prototype.update.call(this, delta);

    this.secondsLeft -= delta;

    minutes = Math.round(this.secondsLeft / 60);
    seconds = Math.round(this.secondsLeft % 60);
    // TODO break this out into two labels, to prevent text jumping
    this.timerLabel.text = minutes + ':' + seconds;
};

GameScene.prototype.onPointStart = function (points) {
    var values, row, column;

    // Determine if within grid bounds
    values = this.puzzleGrid.getRowAndColumn(points[0]);
    row = values[0];
    column = values[1];

    if (row !== null && column !== null) {
        this.markOrFill(row, column);
        this.puzzleGrid.highlight(column, row);
    }

    this.previousRow = row;
    this.previousColumn = column;
};

GameScene.prototype.onPointMove = function (points) {
    var values, row, column;

    values = this.puzzleGrid.getRowAndColumn(points[0]);
    row = values[0];
    column = values[1];

    if (row === this.previousRow && column === this.previousColumn) {
        return;
    }

    if (row !== null && column !== null) {
        this.markOrFill(row, column);
        this.puzzleGrid.highlight(column, row);
    }

    this.previousRow = row;
    this.previousColumn = column;
};

GameScene.prototype.onPointEnd = function (points) {
    this.puzzleGrid.highlight(null, null);
};

GameScene.prototype.markOrFill = function (row, column) {
    var index,
        valid,
        block,
        existingBlock,
        offsetToCenter;

    index = row * this.puzzleSize + column;
    valid = this.clues[index] === 1;
    existingBlock = this.state[index];
    offsetToCenter = 5;

    if (this.action === GameScene.FILL) {
        if (existingBlock) {
            // Already either marked or filled
            sona.play('invalid');
        } else if (valid) {
            // Fill
            block = this.filledBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 1.5;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            this.preview.plot(column, row);
            sona.play('fill');

            this.checkCompleteness(row, column);
            this.checkWinCondition();
        } else {
            // Invalid move
            this.secondsLeft -= 60;
            sona.play('error');
        }
    } else if (this.action === GameScene.MARK) {
        if (!existingBlock) {
            // Mark
            block = this.markedBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 1.3;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            sona.play('mark');
        } else if (existingBlock && existingBlock.type === GameScene.MARK) {
            // Remove previous mark
            this.markedBlocks.deactivate(existingBlock);
            this.state[index] = null;
            sona.play('mark');
        } else {
            // Block is already filled
            sona.play('invalid');
        }
    }

};

GameScene.prototype.checkWinCondition = function () {
    var success = true,
        self = this,
        completed;

    this.clues.forEach(function (clue, index) {
        if (clue === 0 || !success) {
            return;
        }

        if (!self.state[index] || self.state[index].type !== GameScene.FILL) {
            success = false;
        }
    });

    if (success) {
        completed = localStorage.getObject('completed') || Array(LEVELS.length);
        completed[this.puzzleIndex] = true;
        localStorage.setObject('completed', completed);

        window.setTimeout(function () {
            window.alert('You won!');
            Arcadia.changeScene(LevelSelectScene);
        }, 1000);
    }
};


GameScene.prototype.checkCompleteness = function (row, column) {
    var i,
        rowIndex,
        columnIndex,
        rowTotal = 0,
        columnTotal = 0,
        completedRowTotal = 0,
        completedColumnTotal = 0;

    for (i = 0; i < this.puzzleSize; i += 1) {
        rowIndex = row * this.puzzleSize + i;
        columnIndex = i * this.puzzleSize + column;

        if (this.state[rowIndex] && this.state[rowIndex].type === GameScene.FILL) {
            completedRowTotal += 1;
        }

        if (this.state[columnIndex] && this.state[columnIndex].type === GameScene.FILL) {
            completedColumnTotal += 1;
        }

        if (this.clues[rowIndex] === 1) {
            rowTotal += 1;
        }

        if (this.clues[columnIndex] === 1) {
            columnTotal += 1;
        }
    }

    if (rowTotal === completedRowTotal) {
        this.puzzleGrid.horizontalClues[row].color = 'lightgrey';
    }

    if (columnTotal === completedColumnTotal) {
        this.puzzleGrid.verticalClues[column].color = 'lightgrey';
    }
};

GameScene.prototype.generateRandomPuzzle = function (difficulty) {
    var clues,
        value,
        percentage;

    if (difficulty === 'Easy') {
        percentage = 0.68;
    } else if (difficulty === 'Medium') {
        percentage = 0.62;
    } else {
        percentage = 0.55;
    }

    clues = [];

    while (clues.length < 100) {
        if (Math.random() < percentage) {
            value = 1;
        } else {
            value = 0;
        }

        clues.push(value);
    }

    return clues;
};

GameScene.prototype.setupButtons = function () {
    var self = this;

    this.markButton = new Arcadia.Button({
        position: { x: -185, y: 600 },
        size: { width: 340, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'mark',
            font: '64px uni_05_53',
            color: 'orange',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.action = GameScene.MARK;
            self.fillButton.label.color = 'white';
            this.label.color = 'orange';
        }
    });
    this.add(this.markButton);

    this.fillButton = new Arcadia.Button({
        position: { x: 185, y: 600 },
        size: { width: 340, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'fill',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.action = GameScene.FILL;
            self.markButton.label.color = 'white';
            this.label.color = 'orange';
            // console.debug('Setting action to `fill`');
        }
    });
    this.add(this.fillButton);

    // "Clear" button
    this.add(new Arcadia.Button({
        position: { x: 185, y: -600 },
        size: { width: 340, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'clear',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            // Reset state
            self.filledBlocks.deactivateAll();
            self.markedBlocks.deactivateAll();
            for (var i = 0; i < self.state.length; i += 1) {
                self.state[i] = null;
            }
        }
    }));

    // "Quit" button
    this.add(new Arcadia.Button({
        position: { x: -185, y: -600 },
        size: { width: 340, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'quit',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            if (confirm('Are you sure you want to quit?')) {
                Arcadia.changeScene(LevelSelectScene);
            }
        }
    }));
};
