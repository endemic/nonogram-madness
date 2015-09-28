/*jslint sloppy: true */
/*globals Arcadia, TitleScene, Grid, LEVELS, window, console, localStorage,
LevelSelectScene, Block, Preview, sona */

var GameScene = function GameScene(options) {
    Arcadia.Scene.apply(this, arguments);

    sona.loop('bgm-tutorial');

    this.puzzleIndex = options.level;
    if (this.puzzleIndex === undefined) {
        this.puzzleIndex = 30;
    }
    this.puzzle = LEVELS[this.puzzleIndex];
    this.clues = this.puzzle.clues;
    this.secondsLeft = 1739; // ~ 29 * 60

    // TODO: base `showTutorial` off the level we've written hints for
    this.showTutorial = options.showTutorial || false;
    this.tutorialStep = 0;

    if (this.puzzle.difficulty === 'random') {
        this.clues = this.generateRandomPuzzle(this.puzzle.title);
    }

    this.action = GameScene.MARK;
    this.puzzleSize = Math.sqrt(this.clues.length);
    this.state = new Array(this.clues.length);

    this.puzzleGrid = new Grid({
        size: Math.sqrt(this.clues.length),
        clues: this.clues,
        position: {
            x: 0,
            y: this.size.height / 2 - Grid.MAX_SIZE / 2 - 140
        },
        zIndex: 5
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

    this.errorMessages = new Arcadia.Pool();
    this.errorMessages.factory = function () {
        return new Arcadia.Label({
            color: 'black',
            font: '48px uni_05_53',
            reset: function () {
                this.alpha = 1;
            }
        });
    };
    this.add(this.errorMessages);

    this.drawUi();

    if (this.tutorial) {
        this.activate(this.tutorialLabelBackground);
        this.displayTutorial();
        this.hint = new Arcadia.Shape({
            color: 'orange',
            alpha: 0,
            size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE }
        });
        this.add(this.hint);
    }
};

GameScene.prototype = new Arcadia.Scene();

GameScene.FILL = 'fill';
GameScene.MARK = 'mark';

GameScene.prototype.update = function update(delta) {
    var minutes,
        seconds,
        indices,
        success,
        self = this;

    Arcadia.Scene.prototype.update.call(this, delta);

    this.secondsLeft -= delta;

    minutes = this.zeroPad(Math.round(this.secondsLeft / 60), 2);
    seconds = this.zeroPad(Math.round(this.secondsLeft % 60), 2);
    // TODO break this out into two labels, to prevent text jumping
    this.timerLabel.text = minutes + ':' + seconds;

    if (this.showTutorial) {
        // check for player filling certain blocks
        switch (this.tutorialStep) {
        case 0:
            indices = [0, 5, 10, 15, 20];
            break;
        case 1:
            indices = [1, 2, 3, 4, 5];
            break;
        case 2:
            indices = [1, 2, 3, 4, 5];
            break;
        case 4:
            indices = [1, 2, 3, 4, 5];
            break;
        }

        success = indices.every(function (index) {
            return self.state[index] && self.state[index].type === GameScene.FILL;
        });

        if (success) {
            this.tutorialStep += 1;
            this.displayTutorial();
        }
    }
};

GameScene.prototype.zeroPad = function zeroPad(string, length) {
    string = String(string);
    length = parseInt(length, 10);

    while (string.length < length) {
        string = '0' + string;
    }

    return string;
};

GameScene.prototype.displayTutorial = function () {
    var text,
        action;

    action = Arcadia.ENV.mobile ? 'Tap' : 'Click';

    text = [
        'intentionally left blank',
        action + ' and drag to\ndraw a rectangle on\ntop of each number.',
        'Each number\nequals the area\nof its rectangle.',
        'Rectangles cover\nonly one number.',
        'Rectangles\ncan\'t overlap!'
    ];

    this.hint.alpha = 0.5;

    this.tutorialLabel.text = text[this.tutorialStep];

    switch (this.tutorialStep) {
    case 1:
        this.hint.position = { x: 36.5, y: 33.5 };
        this.hint.size = { width: 109.5, height: 109.5 };
        break;
    case 2:
        this.hint.position = { x: 36.5, y: 124.75 };
        this.hint.size = { width: 109.5, height: 73 };
        break;
    case 3:
        this.hint.position = { x: -54.75, y: 124.75 };
        this.hint.size = { width: 73, height: 73 };
        break;
    case 4:
        this.hint.position = { x: -54.75, y: 33.5 };
        this.hint.size = { width: 73, height: 109.5 };
        break;
    default:
        this.hint.alpha = 0;
        break;
    }
};

GameScene.prototype.onPointStart = function onPointStart(points) {
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

GameScene.prototype.onPointMove = function onPointMove(points) {
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

GameScene.prototype.onPointEnd = function () {
    this.puzzleGrid.highlight(null, null);
    this.actionLock = 'none';
};

GameScene.prototype.markOrFill = function markOrFill(row, column) {
    var index,
        valid,
        block,
        existingBlock,
        offsetToCenter,
        message,
        self = this;

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
            message = this.errorMessages.activate();
            message.text = '-1 minute';
            message.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left;
            message.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top;
            message.tween('alpha', 0, 1200, 'linearNone', function () { self.errorMessages.deactivate(message); });
            sona.play('error');
        }
    } else if (this.action === GameScene.MARK) {
        if (!existingBlock && this.actionLock !== 'remove') {
            // Mark
            this.actionLock = 'mark';
            block = this.markedBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 1.3;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            sona.play('mark');
        } else if (existingBlock && existingBlock.type === GameScene.MARK && this.actionLock !== 'mark') {
            // Remove previous mark
            this.actionLock = 'remove';
            this.markedBlocks.deactivate(existingBlock);
            this.state[index] = null;
            sona.play('mark');
        } else {
            // Block is already filled
            sona.play('invalid');
        }
    }

};

GameScene.prototype.checkWinCondition = function checkWinCondition() {
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
        completed = localStorage.getObject('completed') || new Array(LEVELS.length);
        completed[this.puzzleIndex] = true;
        localStorage.setObject('completed', completed);

        window.setTimeout(function () {
            window.alert('You won!');
            Arcadia.changeScene(LevelSelectScene);
        }, 1000);
    }
};


GameScene.prototype.checkCompleteness = function checkCompleteness(row, column) {
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

GameScene.prototype.generateRandomPuzzle = function generateRandomPuzzle(difficulty) {
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

GameScene.prototype.drawUi = function drawUi() {
    var self = this,
        timerBackground,
        timeLeftLabel,
        previewBackground,
        previewLabel,
        markIcon,
        fillIcon;

    timerBackground = new Arcadia.Shape({
        size: { width: 340, height: 270 },
        position: { x: -185, y: -390 },
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(timerBackground);

    timeLeftLabel = new Arcadia.Label({
        position: { x: 0, y: 50 },
        text: 'time left',
        color: 'black',
        font: '64px uni_05_53'
    });
    timerBackground.add(timeLeftLabel);

    this.timerLabel = new Arcadia.Label({
        position: { x: 0, y: -45 },
        text: '30:00',
        color: 'black',
        font: '88px uni_05_53'
    });
    timerBackground.add(this.timerLabel);

    previewBackground = new Arcadia.Shape({
        size: { width: 340, height: 270 },
        position: { x: 185, y: -390 },
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(previewBackground);

    previewLabel = new Arcadia.Label({
        position: { x: 0, y: -110 },
        text: 'preview',
        color: 'black',
        font: '48px uni_05_53'
    });
    previewBackground.add(previewLabel);

    this.preview = new Preview({
        position: { x: 0, y: 20 },
        puzzleSize: this.puzzleSize
    });
    previewBackground.add(this.preview);

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
            position: { x: 40, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.action = GameScene.MARK;
            self.fillButton.label.color = 'white';
            this.label.color = 'orange';
        }
    });
    markIcon = new Arcadia.Shape({
        size: { width: 50, height: 50 },
        position: { x: -90, y: 0 },
        border: '2px black'
    });
    markIcon.add(new Block({ type: 'mark' }));
    this.markButton.add(markIcon);
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
            position: { x: 30, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.action = GameScene.FILL;
            self.markButton.label.color = 'white';
            this.label.color = 'orange';
        }
    });
    fillIcon = new Arcadia.Shape({
        size: { width: 52, height: 52 },
        position: { x: -60, y: 0 }
    });
    fillIcon.add(new Block({ type: 'fill' }));
    this.fillButton.add(fillIcon);
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
            var i;

            sona.play('button');
            // Reset state
            self.filledBlocks.deactivateAll();
            self.markedBlocks.deactivateAll();
            for (i = 0; i < self.state.length; i += 1) {
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
            if (window.confirm('Are you sure you want to quit?')) {
                Arcadia.changeScene(LevelSelectScene);
            }
        }
    }));
};
