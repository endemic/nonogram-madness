/*jslint sloppy: true */
/*globals Arcadia */

var Block = function (options) {
    options = options || {};

    if (options.type === 'fill') {
        options.size = { width: 42, height: 42 };
        options.border = '5px black';
        options.color =  '#665945';
    } else if (options.type === 'mark') {
        options.size = { width: 45, height: 45 };
        options.border = '8px black';
        options.path = function (context) {
            context.moveTo(-this.size.width / 3 * Arcadia.PIXEL_RATIO, this.size.height / 3 * Arcadia.PIXEL_RATIO);
            context.lineTo(this.size.width / 3 * Arcadia.PIXEL_RATIO, -this.size.height / 3 * Arcadia.PIXEL_RATIO);
            context.moveTo(this.size.width / 3 * Arcadia.PIXEL_RATIO, this.size.height / 3 * Arcadia.PIXEL_RATIO);
            context.lineTo(-this.size.width / 3 * Arcadia.PIXEL_RATIO, -this.size.height / 3 * Arcadia.PIXEL_RATIO);
        };
    }

    Arcadia.Shape.call(this, options);
};

Block.prototype = new Arcadia.Shape();
