/*jslint sloppy: true */
/*globals Arcadia */

var Preview = function (options) {
    Arcadia.Shape.apply(this, arguments);

    options = options || {};
    this.puzzleSize = options.puzzleSize || 10;
    this.size = options.size || {
        width: Preview.SIZE,
        height: Preview.SIZE
    };

    this.border = '1px black';

    this.pixels = new Arcadia.Pool();
    this.pixels.factory = function () {
        return new Arcadia.Shape({ color: 'black' });
    };
    this.add(this.pixels);
};

Preview.prototype = new Arcadia.Shape();

Preview.SIZE = 90;

Preview.prototype.clear = function () {
    this.pixels.deactivateAll();
};

Preview.prototype.plot = function (x, y) {
    var pixel,
        previewSize,
        pixelSize;

    previewSize = Math.floor(this.size.width / this.puzzleSize) * this.puzzleSize;
    pixelSize = Math.floor(previewSize / this.puzzleSize);

    pixel = this.pixels.activate();
    pixel.size = { width: pixelSize, height: pixelSize };
    pixel.position = {
        x: -this.size.width / 2 + x * pixelSize + pixelSize / 2,
        y: -this.size.height / 2 + y * pixelSize + pixelSize / 2
    };
};

