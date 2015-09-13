/*jslint sloppy: true */
/*globals Arcadia, TitleScene, localStorage, window, sona */

var AboutScene = function () {
    Arcadia.Scene.apply(this);

    var titleLabel,
        backButton,
        detailLabel,
        rateButton;

    titleLabel = new Arcadia.Label({
        text: 'About',
        font: '96px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        position: {
            x: 0,
            y: -450
        }
    });
    this.add(titleLabel);

    backButton = new Arcadia.Button({
        position: { x: -this.size.width / 2 + 140, y: -this.size.height / 2 + 60 },
        size: { width: 220, height: 70 },
        border: '10px black',
        color: '#665945',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '← title',
            color: 'white',
            font: '48px uni_05_53',
            position: { x: 0, y: -5 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(TitleScene);
        }
    });
    this.add(backButton);

    detailLabel = new Arcadia.Label({
        text: '(c) 2015 Ganbaru Games\n\n \
Programmed by Nathan Demick\n\n \
"Nonogram" concept by\nNon Ishida & Tetsuya Nishio',
        font: '36px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        position: {
            x: 0,
            y: -150
        }
    });
    this.add(detailLabel);

    rateButton = new Arcadia.Button({
        position: { x: 0, y: 0 },
        size: { width: 420, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'Rate this app!',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            var store;
            if (Arcadia.ENV.android) {
                store = 'Google Play';
            } else if (Arcadia.ENV.ios) {
                store = 'the App Store';
            }
            if (window.confirm('Rate in ' + store + '?')) {
                // TODO: obtain real link
                window.open('somewhere', '_blank');
            }
        }
    });

    if (Arcadia.ENV.cordova) {
        this.add(rateButton);
    }
};

AboutScene.prototype = new Arcadia.Scene();
