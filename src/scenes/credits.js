/*globals Arcadia, LevelSelectScene, LEVELS, localStorage */

var CreditsScene = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    var title,
        button,
        description;

    title = new Arcadia.Label({
        position: { x: 0, y: -150 },
        font: '48px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        text: 'Thanks\nFor\nPlaying!'
    });
    this.add(title);

    description = new Arcadia.Label({
        position: { x: 0, y: 0 },
        font: '20px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        text: [
            'Programming by Nathan Demick',
            '(c) 2010-2016 Ganbaru Games',
            'https://ganbarugames.com\n',
            '"Nonogram" concept by',
            'Non Ishida & Tetsuya Nishio'
        ].join('\n')
    });
    this.add(description);

    button = new Arcadia.Button({
        position: { x: 0, y: 200 },
        size: { width: 150, height: 70 },
        text: 'OK',
        font: '36px uni_05_53',
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        action: function () {
            // Clear out saved level data here! start over like a champ
            // localStorage.setObject('completed', new Array(LEVELS.length));
            sona.play('button');
            Arcadia.changeScene(TitleScene);
        }
    });
    this.add(button);
};

CreditsScene.prototype = new Arcadia.Scene();
