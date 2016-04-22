/*jslint sloppy: true */
/*globals Arcadia, TitleScene, localStorage, window, sona */

var AboutScene = function () {
    Arcadia.Scene.apply(this);

    var BUTTON_MARGIN = 65;

    var titleLabel = new Arcadia.Label({
        text: 'About',
        font: '48px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -225 }
    });
    this.add(titleLabel);

    var backButton = new Arcadia.Button({
        position: { x: -this.size.width / 2 + 70, y: -this.size.height / 2 + 30 },
        size: { width: 110, height: 35 },
        border: '5px black',
        color: '#665945',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '< title',
            color: 'white',
            font: '24px uni_05_53',
            position: { x: 0, y: -2.5 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(TitleScene);
        }
    });
    this.add(backButton);

    var creditsText = [
        'Programming by Nathan Demick',
        '(c) 2010 - 2016 Ganbaru Games',
        'https://ganbarugames.com\n',
        '"Nonogram" concept by',
        'Non Ishida & Tetsuya Nishio'
    ].join('\n');

    var detailLabel = new Arcadia.Label({
        text: creditsText,
        font: '18px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -75 }
    });
    this.add(detailLabel);

    var dataResetButton = new Arcadia.Button({
        position: { x: 0, y: 60 },
        size: { width: 210, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'Reset data',
            font: '32px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            sona.play('button');

            if (confirm('Reset all saved data?')) {
                var completed = [];
                while (completed.length < LEVELS.length) {
                    completed.push(null);
                }
                localStorage.setObject('completed', completed);
            }
        }
    });
    this.add(dataResetButton);

    if (Arcadia.ENV.cordova) {
        var rateButton = new Arcadia.Button({
            position: {x: 0, y: dataResetButton.position.y + BUTTON_MARGIN},
            size: {width: 210, height: 45},
            color: '#665945',
            border: '5px black',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            label: new Arcadia.Label({
                text: 'Feedback',
                font: '32px uni_05_53',
                position: {x: 0, y: -5}
            }),
            action: function () {
                window.sona.play('button');

                if (Arcadia.ENV.ios) {
                    window.open('itms-apps://itunes.apple.com/app/id957209934');
                }
            }
        });
        this.add(rateButton);

        var moreGamesButton = new Arcadia.Button({
            position: {x: 0, y: rateButton.position.y + BUTTON_MARGIN},
            size: {width: 210, height: 45},
            color: '#665945',
            border: '5px black',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            label: new Arcadia.Label({
                text: 'More games',
                font: '32px uni_05_53',
                position: {x: 0, y: -5}
            }),
            action: function () {
                window.sona.play('button');

                if (Arcadia.ENV.ios) {
                    window.open('itms-apps://itunes.com/apps/ganbarugames');
                }
            }
        });
        this.add(moreGamesButton);
    }
};

AboutScene.prototype = new Arcadia.Scene();
