/*jslint sloppy: true */
/*globals Arcadia */

var Block = function (options) {
    options = options || {};

    if (options.type === 'fill') {
        options.size = { width: 20, height: 20 };
        options.border = '2px black';
        options.color =  '#665945';
    } else if (options.type === 'mark') {
        options.size = { width: 22.5, height: 22.5 };
        options.border = '4px black';
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
