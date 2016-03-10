/*jslint sloppy: true */
/*globals Arcadia, TitleScene, localStorage, window, sona */

var AboutScene = function () {
    Arcadia.Scene.apply(this);

    var titleLabel,
        backButton,
        detailLabel,
        sfxToggleButton,
        dataResetButton,
        rateButton;

    titleLabel = new Arcadia.Label({
        text: 'About',
        font: '48px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -225 }
    });
    this.add(titleLabel);

    backButton = new Arcadia.Button({
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

    detailLabel = new Arcadia.Label({
        text: 'Programming by Nathan Demick\n \
(c) 2010 - 2016 Ganbaru Games\n \
http://ganbarugames.com\n\n \
"Nonogram" concept by\nNon Ishida & Tetsuya Nishio',
        font: '18px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -75 }
    });
    this.add(detailLabel);

    /* Lawl not actually checking that localstorage bool */
    // sfxToggleButton = new Arcadia.Button({
    //     position: { x: 0, y: 50 },
    //     size: { width: 210, height: 45 },
    //     color: '#665945',
    //     border: '5px black',
    //     shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
    //     label: new Arcadia.Label({
    //         text: (localStorage.getBoolean('playSfx') ? 'Sound on' : 'Sound off'),
    //         font: '32px uni_05_53',
    //         position: { x: 0, y: -3 }
    //     }),
    //     action: function () {
    //         sona.play('button');

    //         if (localStorage.getBoolean('playSfx')) {
    //             localStorage.setBoolean('playSfx', false);
    //             this.text = 'Sound off';
    //         } else {
    //             localStorage.setBoolean('playSfx', true);
    //             this.text = 'Sound on';
    //         }
    //     }
    // });
    // this.add(sfxToggleButton);

    dataResetButton = new Arcadia.Button({
        // position: { x: 0, y: sfxToggleButton.position.y + 60 },
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
                localStorage.setObject('completed', new Array(LEVELS.length));
            }
        }
    });
    this.add(dataResetButton);

    // TODO: enable this
    if (Arcadia.ENV.cordova && false) {
        rateButton = new Arcadia.Button({
            position: { x: 0, y: dataResetButton.position.y + 60 },
            size: { width: 210, height: 45 },
            color: '#665945',
            border: '5px black',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            label: new Arcadia.Label({
                text: 'Feedback',
                font: '32px uni_05_53',
                position: { x: 0, y: -5 }
            }),
            action: function () {
                var store;
                if (Arcadia.ENV.android) {
                    store = 'Google Play';
                } else if (Arcadia.ENV.ios) {
                    store = 'the App Store';
                }
                if (confirm('Rate in ' + store + '?')) {
                    // TODO: obtain real link
                    open('itms-apps://itunes.apple.com/app/386461624', '_blank');
                }
            }
        });

        this.add(rateButton);
    }
};

AboutScene.prototype = new Arcadia.Scene();
