/*jslint sloppy: true */
/*globals Arcadia */

var Block = function (options) {
    var args;

    options = options || {};

    if (options.type === 'fill') {
        args = {
            size: { width: 42, height: 42 },
            border: '5px black',
            color: '#665945',
            type: 'fill'
        };
    } else if (options.type === 'mark') {
        args = {
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
        };
    }

    Arcadia.Shape.call(this, args);
};

Block.prototype = new Arcadia.Shape();
