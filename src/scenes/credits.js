/*globals Arcadia, LevelSelectScene, LEVELS, localStorage */

var CreditsScene = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    var title,
        button,
        description;

    title = new Arcadia.Label({
        position: { x: 0, y: -350 },
        font: '96px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        text: 'Thanks\nFor\nPlaying!'
    });
    this.add(title);

    description = new Arcadia.Label({
        position: { x: 0, y: 0 },
        font: '40px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        text: [
            'Programming by Nathan Demick',
            'Puzzle concept by Nikoli',
            '© 2015 Ganbaru Games',
            'http://ganbarugames.com'
        ].join('\n')
    });
    this.add(description);

    button = new Arcadia.Button({
        position: { x: 0, y: 400 },
        size: { width: 200, height: 90 },
        text: 'OK',
        font: '48px uni_05_53',
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
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
