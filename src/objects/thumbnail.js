/*jslint sloppy: true */
/*globals Arcadia, window, LEVELS, INCOMPLETE */

var Thumbnail = function (options) {
    Arcadia.Shape.apply(this, arguments);

    options = options || {};

    this.size = options.size || {
        width: Thumbnail.SIZE,
        height: Thumbnail.SIZE
    };

    this.border = '10px white';
    this.color = 'white';
    this.shadow = '15px 15px 0 rgba(0, 0, 0, 0.5)';

    this.pixels = new Arcadia.Shape({
        size: {
            width: this.size.width,
            height: this.size.height
        }
    });

    this.pixels.path = function (context) {
        var puzzleSize,
            pixelSize,
            originX,
            originY,
            self = this;

        if (!this.clues) {
            return;
        }

        puzzleSize = Math.sqrt(this.clues.length);
        pixelSize = this.size.width / puzzleSize * Arcadia.PIXEL_RATIO;

        originX = -self.size.width / 2 * Arcadia.PIXEL_RATIO;
        originY = -self.size.height / 2 * Arcadia.PIXEL_RATIO;

        context.fillStyle = 'black';

        this.clues.forEach(function (clue, index) {
            var x = index % puzzleSize,
                y = Math.floor(index / puzzleSize);

            if (clue === 0) {
                return;
            }

            context.fillRect(originX + (x * pixelSize),
                             originY + (y * pixelSize),
                             pixelSize,
                             pixelSize);
        });
    };

    this.add(this.pixels);
};

Thumbnail.prototype = new Arcadia.Shape();

Thumbnail.SIZE = 150;

Thumbnail.prototype.drawPreview = function (levelIndex, completed) {
    var clues;

    if (LEVELS[levelIndex] === undefined) {
        this.alpha = 0;
        return;
    }

    if (this.alpha < 1) {
        this.alpha = 1;
    }

    if (Arcadia.isLocked() && levelIndex > 15) {
        this.border = '10px red';
    }

    if (!completed[levelIndex]) {
        clues = INCOMPLETE.clues;
    } else {
        clues = LEVELS[levelIndex].clues;
    }

    this.pixels.clues = clues;
    this.pixels.dirty = true;
};

Thumbnail.prototype.highlight = function () {
    this.border = '10px orange';
};

Thumbnail.prototype.lowlight = function () {
    this.border = '10px white';
};
