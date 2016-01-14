/*jslint sloppy: true */
/*globals Arcadia, TitleScene, localStorage, confirm, sona */

var OptionsScene = function () {
    Arcadia.Scene.apply(this);

    var titleLabel,
        backButton,
        musicToggleButton,
        sfxToggleButton,
        dataResetButton;

    // TODO: allow "free" mode which doesn't penalize if a mistake is made

    titleLabel = new Arcadia.Label({
        text: 'Options',
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

    musicToggleButton = new Arcadia.Button({
        position: { x: 0, y: 0 },
        size: { width: 420, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: (localStorage.getBoolean('playMusic') ? 'Music ON' : 'Music OFF'),
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');

            if (localStorage.getBoolean('playMusic')) {
                localStorage.setBoolean('playMusic', false);
                this.text = 'Music OFF';
                sona.stop('bgm-one');
            } else {
                localStorage.setBoolean('playMusic', true);
                this.text = 'Music ON';
                sona.loop('bgm-one');
            }
        }
    });
    // this.add(musicToggleButton);

    sfxToggleButton = new Arcadia.Button({
        position: { x: 0, y: musicToggleButton.position.y + 120 },
        size: { width: 420, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: (localStorage.getBoolean('playSfx') ? 'Sound ON' : 'Sound OFF'),
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');

            if (localStorage.getBoolean('playSfx')) {
                localStorage.setBoolean('playSfx', false);
                this.text = 'Sound OFF';
            } else {
                localStorage.setBoolean('playSfx', true);
                this.text = 'Sound ON';
            }
        }
    });
    this.add(sfxToggleButton);

    dataResetButton = new Arcadia.Button({
        position: { x: 0, y: sfxToggleButton.position.y + 120 },
        size: { width: 420, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'Reset data',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');

            if (confirm('Reset all saved data?')) {
                // TODO: figure out what this does
            }
        }
    });
    this.add(dataResetButton);
};

OptionsScene.prototype = new Arcadia.Scene();
