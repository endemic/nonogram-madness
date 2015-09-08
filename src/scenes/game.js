/*globals Arcadia, TitleScene, Grid, LEVELS, window, console, localStorage, sona */

var GameScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    var self = this;

    sona.loop('bgm-tutorial');

    this.puzzleIndex = options.level || 30;
    this.puzzle = LEVELS[this.puzzleIndex];
    this.clues = this.puzzle.clues;

    if (this.puzzle.difficulty === 'random') {
        this.clues = this.generateRandomPuzzle(this.puzzle.title);
    }

    this.action = GameScene.MARK;
    this.state = [];

    var i = this.clues.length;
    while (i--) {
        this.state.push(null);
    }

    // TODO: rename this var
    this.timer = 1740;

    this.puzzleGrid = new Grid({
        size: Math.sqrt(this.clues.length),
        clues: this.clues,
        position: {
            x: 0,
            y: this.size.height / 2 - Grid.MAX_SIZE / 2 - 140
        }
    });
    this.add(this.puzzleGrid);

    // TODO: extract the "fill" block to its own file
    this.filledBlocks = new Arcadia.Pool();
    this.filledBlocks.factory = function () {
        return new Arcadia.Shape({
            size: { width: 42, height: 42 },
            border: '5px black',
            color: '#665945',
            type: 'fill'
        });
    };
    this.add(this.filledBlocks);

    // Pre-instantiate some of these objects
    while (this.filledBlocks.length < 50) {
        this.filledBlocks.activate();
    }
    this.filledBlocks.deactivateAll();

    // `mark` blocks
    // TODO: extract the "mark" block to its own file
    this.markedBlocks = new Arcadia.Pool();
    this.markedBlocks.factory = function () {
        return new Arcadia.Shape({
            size: { width: 45, height: 45 },
            border: '8px black',
            type: 'mark',
            path: function (context) {
                // TODO: Pixel ratio
                context.moveTo(-this.size.width / 2 + 2, this.size.height / 2 - 2);
                context.lineTo(this.size.width / 2 - 2, -this.size.height / 2 + 2);
                context.moveTo(this.size.width / 2 - 2, this.size.height / 2 - 2);
                context.lineTo(-this.size.width / 2 + 2, -this.size.height / 2 + 2);
            }
        });
    };
    this.add(this.markedBlocks);

    while (this.markedBlocks.length < 50) {
        this.markedBlocks.activate();
    }
    this.markedBlocks.deactivateAll();

    var timerBackground = new Arcadia.Shape({
        size: { width: 340, height: 270 },
        position: { x: -180, y: -390 },
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
        position: { x: 180, y: -390 },
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
        position: { x: 0, y: 0 }
    });
    previewBackground.add(this.preview);

    this.setupButtons();
};

GameScene.prototype = new Arcadia.Scene();

GameScene.FILL = 1;
GameScene.MARK = 2;

GameScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.timer -= delta;

    var minutes,
        seconds;

    minutes = Math.round(this.timer / 60);
    seconds = Math.round(this.timer % 60);
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
    }

    this.previousRow = row;
    this.previousColumn = column;
};

GameScene.prototype.onPointEnd = function (points) {
    // do something here?
};

GameScene.prototype.markOrFill = function (row, column) {
    var index = row * 10 + column; // TODO: get rid of this magic number
    var valid = this.clues[index] === 1;
    var existingBlock = this.state[index];
    var block;
    var offsetToCenter = 3;

    if (this.action === GameScene.FILL) {
        if (existingBlock && existingBlock.type === 'fill') {
            console.log('already filled');
            // Play "click" sound (or remove the block)
            sona.play('invalid');
        } else if (valid) {
            block = this.filledBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 1.5;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            this.preview.plot(column, row);
            sona.play('fill');
        } else {
            // MISTAKE!
            // Subtract time, etc.
            console.debug('wrong answer!');
            sona.play('error');
        }
    } else if (this.action === GameScene.MARK) {
        if (!existingBlock) {
            block = this.markedBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.bounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 1.3;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            console.log('Trying to mark block');
            sona.play('mark');
        } else if (existingBlock && existingBlock.type === 'mark') {
            this.markedBlocks.deactivate(existingBlock);
            this.state[index] = null;
            console.log('removing mark');
            sona.play('mark');
        } else {
            // block is filled; make "click" noise
            console.log('block already filled');
            sona.play('invalid');
        }
    }

};

GameScene.prototype.generateRandomPuzzle = function (difficulty) {
    var clues, value, percentage;

    if (difficulty === 'Easy') {
        percentage = 0.68;
    } else if (difficulty === 'Medium') {
        percentage = 0.62;
    } else {
        percentage = 0.55;
    }

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
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.action = GameScene.MARK;
            self.fillButton.label.color = 'white';
            this.label.color = 'orange';
            console.debug('Setting action to `mark`');
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
            console.debug('Setting action to `fill`');
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
                Arcadia.changeScene(Title);
            }
        }
    }));
};
