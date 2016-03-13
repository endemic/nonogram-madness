/*jslint sloppy: true */
/*globals Arcadia, sona, LevelSelectScene, RulesScene, OptionsScene, AboutScene */

var TitleScene = function () {
    Arcadia.Scene.apply(this);

    var titleLineOne,
        titleLineTwo,
        playButton,
        rulesButton,
        optionsButton,
        aboutButton,
        self = this;

    titleLineOne = new Arcadia.Label({
        text: 'nonogram',
        font: '64px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 137.5 }
    });
    this.add(titleLineOne);

    titleLineTwo = new Arcadia.Label({
        text: 'madness',
        font: '70px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 200 }
    });
    this.add(titleLineTwo);

    playButton = new Arcadia.Button({
        position: { x: 0, y: 0 },
        size: { width: 175, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'play',
            font: '32px uni_05_53',
            position: { x: 0, y: -5 }
        }),
        action: function () {
            sona.play('button');
            // self.stopMusic();
            var completedLevels = localStorage.getObject('completedLevels') || [];
            while (completedLevels.length < LEVELS.length) {
                completedLevels.push(null);
            }
            var incompleteLevel = completedLevels.indexOf(null);

            // TOOO: Extract this code from here & game scene
            if (incompleteLevel === -1) {
                Arcadia.changeScene(LevelSelectScene);
            } else if (Arcadia.isLocked() && incompleteLevel >= Arcadia.FREE_LEVEL_COUNT) {
                Arcadia.changeScene(UnlockScene);
            } else {
                Arcadia.changeScene(GameScene, { level: incompleteLevel });
            }
        }
    });
    this.add(playButton);

    rulesButton = new Arcadia.Button({
        position: { x: 0, y: playButton.position.y + 60 },
        size: { width: 175, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'rules',
            font: '32px uni_05_53',
            position: { x: 0, y: -5 }
        }),
        action: function () {
            sona.play('button');
            self.stopMusic();
            Arcadia.changeScene(RulesScene);
        }
    });
    this.add(rulesButton);

    /*
    optionsButton = new Arcadia.Button({
        position: { x: 0, y: rulesButton.position.y + 120 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'options',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            self.stopMusic();
            Arcadia.changeScene(OptionsScene);
        }
    });
*/
    // this.add(optionsButton);

    aboutButton = new Arcadia.Button({
        position: { x: 0, y: rulesButton.position.y + 60 },
        size: { width: 175, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'about',
            font: '32px uni_05_53',
            position: { x: 0, y: -5 }
        }),
        action: function () {
            sona.play('button');
            // self.stopMusic();
            Arcadia.changeScene(AboutScene);
        }
    });
    this.add(aboutButton);

    // this.startMusic();
};

TitleScene.prototype = new Arcadia.Scene();

TitleScene.prototype.startMusic = function startMusic() {
    // TODO: eventually re-implement music
    return;

    if (localStorage.getBoolean('playMusic') === false) {
        return;
    }

    if (Math.random() < 0.5) {
        this.bgm = 'bgm-one';
    } else {
        this.bgm = 'bgm-two';
    }

    sona.loop(this.bgm);
};

TitleScene.prototype.stopMusic = function stopMusic() {
    // TODO: Eventually re-implement music
    return;
    
    if (localStorage.getBoolean('playMusic') === false) {
        return;
    }
    sona.stop(this.bgm);
};
