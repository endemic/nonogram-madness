/*jslint sloppy: true */
/*globals Arcadia, sona, LevelSelectScene, RulesScene, OptionsScene, AboutScene */

var TitleScene = function () {
    Arcadia.Scene.apply(this);

    var titleLineOne,
        titleLineTwo,
        playButton,
        rulesButton,
        optionsButton,
        aboutButton;

    titleLineOne = new Arcadia.Label({
        text: 'nonogram',
        font: '128px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 275 }
    });
    this.add(titleLineOne);

    titleLineTwo = new Arcadia.Label({
        text: 'madness',
        font: '140px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 400 }
    });
    this.add(titleLineTwo);

    playButton = new Arcadia.Button({
        position: { x: 0, y: 0 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'play',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            var completed,
                incompleteLevel;

            sona.play('button');
            completed = localStorage.getObject('completed') || Array(LEVELS.length);
            incompleteLevel = completed.indexOf(null);

            if (incompleteLevel === -1) {
                Arcadia.changeScene(LevelSelectScene);
            } else if (Arcadia.isLocked() && incompleteLevel >= 15) {
                Arcadia.changeScene(UnlockScene);
            } else {
                Arcadia.changeScene(GameScene, { level: incompleteLevel });
            }
        }
    });
    this.add(playButton);

    rulesButton = new Arcadia.Button({
        position: { x: 0, y: playButton.position.y + 120 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'rules',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(RulesScene);
        }
    });
    this.add(rulesButton);

    optionsButton = new Arcadia.Button({
        position: { x: 0, y: rulesButton.position.y + 120 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'options',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(OptionsScene);
        }
    });
    this.add(optionsButton);

    aboutButton = new Arcadia.Button({
        position: { x: 0, y: optionsButton.position.y + 120 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'about',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(AboutScene);
        }
    });
    this.add(aboutButton);

    sona.loop('bgm-one');
};

TitleScene.prototype = new Arcadia.Scene();
