/*jslint sloppy: true */
/*globals Arcadia, window, console, localStorage, sona */

var Grid = function (options) {
    Arcadia.Shape.apply(this, arguments);

    this.cellCount = options.size;
    this.cellSize = Grid.CELL_SIZE;

    this.size = {
        width: this.cellSize * this.cellCount + Grid.CLUE_AREA_SIZE,
        height: this.cellSize * this.cellCount + Grid.CLUE_AREA_SIZE
    };

    this.color = null;
    this.border = '2px white';

    this.calculateBounds();

    this.lines = new Arcadia.Shape({
        size: {
            width: this.size.width,
            height: this.size.height
        }
    });

    var self = this;

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
        context.strokeStyle = 'white';
        context.stroke();
    };
    this.add(this.lines);
};

Grid.prototype = new Arcadia.Shape();

Grid.MAX_SIZE = 372;
Grid.CELL_SIZE = 26; // Cells go over ~70% of grid
Grid.CLUE_AREA_SIZE = 112; // 372 - 26 * 10

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
