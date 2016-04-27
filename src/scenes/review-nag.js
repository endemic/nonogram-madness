/*globals Arcadia, LevelSelectScene, CreditsScene, localStorage, store, window */

(function (root) {
    'use strict';

    var ReviewNagScene = function (options) {
        Arcadia.Scene.apply(this, arguments);

        Arcadia.cycleBackground();

        options = options || {};

        // Never show again
        localStorage.setBoolean('nagShown', true);

        var text = [
            'I hope you\'ve enjoyed',
            'solving nonograms so far.',
            'Would you mind reviewing',
            'my app? I love feedback!'
        ];

        var description = new Arcadia.Label({
            position: { x: 0, y: -150 },
            font: '24px uni_05_53',
            shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
            text: text.join('\n')
        });
        this.add(description);

        /* Buttons */

        var yesButton = new Arcadia.Button({
            position: { x: 0, y: 50 },
            size: { width: 100, height: 45 },
            text: 'sure thing',
            font: '24px uni_05_53',
            color: '#665945',
            border: '3px black',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            action: function () {
                sona.play('button');

                // Go to game for when they come back
                Arcadia.changeScene(GameScene, {level: options.level});

                // Open app store
                if (Arcadia.ENV.ios) {
                    window.open('itms-apps://itunes.apple.com/app/id957209934');
                }
            }
        });
        this.add(yesButton);

        var noButton = new Arcadia.Button({
            position: { x: 0, y: 112 },
            size: { width: 100, height: 45 },
            text: 'don\'t bother me',
            font: '24px uni_05_53',
            color: '#665945',
            border: '3px black',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(GameScene, {level: options.level});
            }
        });
        this.add(noButton);
    };

    ReviewNagScene.prototype = new Arcadia.Scene();

    root.ReviewNagScene = ReviewNagScene;
}(window));
