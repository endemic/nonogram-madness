/*jslint sloppy: true */
/*globals Arcadia */

var Grid = function (options) {
    Arcadia.Shape.apply(this, arguments);

    var self = this;

    this.clues = options.clues;
    this.cellCount = options.size;
    this.cellSize = Grid.CELL_SIZE;

    this.size = {
        width: this.cellSize * this.cellCount + Grid.CLUE_AREA_SIZE,
        height: this.cellSize * this.cellCount + Grid.CLUE_AREA_SIZE
    };

    this.color = 'white';
    this.border = '2px black';
    this.shadow = '10px 10px 0 rgba(0, 0, 0, 0.5)';

    this.calculateBounds();

    if (options.clues !== undefined) {
        this.drawClues();
    }

    this.lines = new Arcadia.Shape({
        size: {
            width: this.size.width,
            height: this.size.height
        }
    });

    this.lines.path = function (context) {
        var i,
            left,
            right,
            top,
            bottom;

        left = -self.size.width / 2;
        right = self.size.width / 2;
        top = -self.size.height / 2;
        bottom = self.size.height / 2;

        for (i = 0; i <= self.cellCount; i += 1) {
            // Horizontal lines
            context.moveTo(left * Arcadia.PIXEL_RATIO, (bottom - self.cellSize * i) * Arcadia.PIXEL_RATIO);
            context.lineTo(right * Arcadia.PIXEL_RATIO, (bottom - self.cellSize * i) * Arcadia.PIXEL_RATIO);

            // Vertical lines
            context.moveTo((right - self.cellSize * i) * Arcadia.PIXEL_RATIO, top * Arcadia.PIXEL_RATIO);
            context.lineTo((right - self.cellSize * i) * Arcadia.PIXEL_RATIO, bottom * Arcadia.PIXEL_RATIO);
        }

        // Draw grid
        context.lineWidth = 2 * Arcadia.PIXEL_RATIO;
        context.strokeStyle = 'black';
        context.stroke();
    };
    this.add(this.lines);

    this.horizontalHighlight = new Arcadia.Shape({
        color: 'orange',
        alpha: 0.5,
        size: { width: Grid.CLUE_AREA_SIZE, height: Grid.CELL_SIZE }
    });
    this.add(this.horizontalHighlight);
    // this.deactivate(this.horizontalHighlight);

    this.verticalHighlight = new Arcadia.Shape({
        color: 'orange',
        alpha: 0.5,
        size: { width: Grid.CELL_SIZE, height: Grid.CLUE_AREA_SIZE }
    });
    this.add(this.verticalHighlight);
    // this.deactivate(this.verticalHighlight);
};

Grid.prototype = new Arcadia.Shape();

Grid.MAX_SIZE = 750;
Grid.CELL_SIZE = 52; // Cells go over ~70% of grid
Grid.CLUE_AREA_SIZE = Grid.MAX_SIZE - (Grid.CELL_SIZE * 10);

Grid.prototype.containsPoint = function (point) {
    return point.x < this.bounds.right &&
        point.x > this.bounds.left &&
        point.y < this.bounds.bottom &&
        point.y > this.bounds.top;
};

Grid.prototype.getRowAndColumn = function (point) {
    if (!this.containsPoint(point)) {
        return [null, null];
    }

    var row, column;

    // NOTE: current levels consider 0, 0 to be upper left instead of lower left
    //row = Math.floor((this.gridBounds.bottom - point.y) / this.cellSize);

    row = Math.floor((point.y - this.bounds.top) / this.cellSize);
    column = Math.floor((point.x - this.bounds.left) / this.cellSize);

    return [row, column];
};

Grid.prototype.highlight = function (x, y) {
    this.horizontalHighlight.position = {
        x: -this.size.width / 2 + Grid.CLUE_AREA_SIZE / 2,
        y: -this.size.height / 2 + Grid.CLUE_AREA_SIZE + (y * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2
    };

    this.verticalHighlight.position = {
        x: -this.size.width / 2 + Grid.CLUE_AREA_SIZE + (x * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2,
        y: -this.size.height / 2 +  Grid.CLUE_AREA_SIZE / 2
    };
};

Grid.prototype.calculateBounds = function () {
    var right = this.size.width / 2,
        bottom = this.size.height / 2;

    // Get bounds of user interactive area
    this.bounds = {
        right: right + this.position.x,
        left: (right - (this.cellSize * this.cellCount)) + this.position.x,
        bottom: bottom + this.position.y,
        top: (bottom - (this.cellSize * this.cellCount)) + this.position.y
    };
};

Grid.prototype.resize = function (newCellCount) {
    // Do nothing if passed a bogus arg
    newCellCount = newCellCount || this.cellCount;

    this.cellCount = newCellCount;

    this.size = {
        width: this.cellSize * this.cellCount,
        height: this.cellSize * this.cellCount
    };

    // Also resize the grid lines
    this.lines.size = this.size;

    this.calculateBounds();
};

Grid.prototype.drawClues = function () {
    var i,
        x,
        y,
        index,
        label,
        horizontalClue,
        verticalClue,
        horizontalCounter,
        verticalCounter,
        previousVertical,
        previousHorizontal;

    this.verticalClues = [];
    this.horizontalClues = [];

    for (i = 0; i < this.cellCount; i += 1) {
        label = new Arcadia.Label({
            position: {
                x: -this.size.width / 2 + Grid.CLUE_AREA_SIZE + (i * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2,
                y: -this.size.height / 2 +  Grid.CLUE_AREA_SIZE / 2
            },
            text: '2\n2\n2\n4\n5',
            color: 'black',
            font: '40px uni_05_53'
        });

        this.add(label);
        this.verticalClues.push(label);

        label = new Arcadia.Label({
            position: {
                x: -this.size.width / 2 + Grid.CLUE_AREA_SIZE / 2,
                y: -this.size.height / 2 + Grid.CLUE_AREA_SIZE + (i * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2
            },
            text: '1 2 3 4 5',
            color: 'black',
            font: '40px uni_05_53'
        });

        this.add(label);
        this.horizontalClues.push(label);
    }

    for (x = 0; x < this.cellCount; x += 1) {
        horizontalClue = '';
        verticalClue = '';
        horizontalCounter = 0;
        verticalCounter = 0;
        previousVertical = false;
        previousHorizontal = false;

        for (y = 0; y < this.cellCount; y += 1) {
            // horizontal clues
            index = x * this.cellCount + y;
            if (this.clues[index] === 1) {
                horizontalCounter += 1;
                previousHorizontal = true;
            } else if (previousHorizontal) {
                horizontalClue += horizontalCounter + ' ';
                horizontalCounter = 0;
                previousHorizontal = false;
            }
        }

        for (y = 0; y < this.cellCount; y += 1) {
            // vertical clues
            index = y * this.cellCount + x;
            if (this.clues[index] === 1) {
                verticalCounter += 1;
                previousVertical = true;
            } else if (previousVertical) {
                verticalClue += verticalCounter + '\n';
                verticalCounter = 0;
                previousVertical = false;
            }
        }

        // Check for condition when a row or column ends with filled blocks
        if (previousHorizontal) {
            horizontalClue += horizontalCounter + ' ';
        }

        if (previousVertical) {
            verticalClue += verticalCounter + '\n';
        }

        if (horizontalClue === '') {
            horizontalClue = '0';
        }

        if (verticalClue === '') {
            verticalClue = '0\n';
        }

        while (horizontalClue.length < 14) {
            horizontalClue = ' ' + horizontalClue;
        }

        while (verticalClue.length < 14) {
            verticalClue = ' \n' + verticalClue;
        }

        this.verticalClues[x].text = verticalClue;
        this.horizontalClues[x].text = horizontalClue;
    }
};
