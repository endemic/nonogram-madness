/*jslint sloppy: true */
/*globals Arcadia */

(function (root) {
    var Modal = function (options) {
        options = options || {};
        Arcadia.Shape.call(this, options);

        this.size = {
            width: Arcadia.VIEWPORT_WIDTH / 2,
            height: Arcadia.VIEWPORT_WIDTH / 2
        };
        this.border = '1px black',
        this.shadow = '8px 8px 0 rgba(0, 0, 0, 0.5)';
        this.PADDING = 10;

        this.enablePointEvents = true; // pass mouse/touch events to children (i.e. buttons)

        var modal = this;

        // Add arbitrary content; could be a label, or shape, etc.
        var content = options.content || [];

        content.forEach(function (item, index, array) {
            var previousItemPosition;

            if (index > 0) {
                previousItemPosition = content[index - 1].position;
            } else {
                previousItemPosition = -modal.size.height / 2 + modal.PADDING;
            }

            array[index].position = {x: 0, y: previousItemPosition.y + item.size.height};

            modal.add(array[index]);
        });

        // How to handle buttons? left is cancel, right is action
        var buttons = options.buttons || ['ok'];
        var action = options.action || this.dismiss.bind(this);

        buttons.forEach(function (text, index) {
            var button = new Arcadia.Button({
                position: { x: -this.size.width / 2 + 70, y: -this.size.height / 2 + 30 },
                size: { width: 110, height: 35 },
                border: '5px black',
                color: '#665945',
                shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
                label: new Arcadia.Label({
                    text: text,
                    font: '24px uni_05_53',
                    position: { x: 0, y: -2.5 }
                })
            });

            if (index === buttons.length - 1) {
                button.action = action;
            }

            modal.add(button);
        });
    };

    Modal.prototype = new Arcadia.Shape();

    Modal.prototype.display = function () {
        this.position = {
            x: 0,
            y: -Arcadia.VIEWPORT_HEIGHT
        };

        this.tween('position', {x: 0, y: 0}, 750, 'expoOut');
    };

    Modal.prototype.dismiss = function () {
        this.tween('position', {x: 0, y: -Arcadia.VIEWPORT_HEIGHT}, 750, 'expoIn', callback);
    };
}(window));
