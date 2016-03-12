/*jslint sloppy: true */
/*globals Arcadia, window, console, localStorage, sona, LEVELS,
GameScene, TitleScene, Thumbnail */

var LevelSelectScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    options = options || {};

    var title,
        backButton,
        unlockButton,
        playButton,
        self = this;

    this.selectedLevel = parseInt(localStorage.getItem('selectedLevel'), 10) || options.level || 0;
    this.perPage = 9;
    this.currentPage = Math.floor(this.selectedLevel / this.perPage);
    this.totalPages = Math.ceil(LEVELS.length / this.perPage);
    this.completedLevels = localStorage.getObject('completedLevels') || [];
    while (this.completedLevels.length < LEVELS.length) {
        this.completedLevels.push(null);
    }

    this.pageLabel = new Arcadia.Label({
        position: { x: 0, y: -145 },
        font: '16px uni_05_53',
        shadow: '3px 3px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.pageLabel);

    this.puzzleLabel = new Arcadia.Label({
        position: { x: 0, y: 160 },
        font: '24px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.puzzleLabel);

    this.difficultyLabel = new Arcadia.Label({
        position: { x: 0, y: 190 },
        font: '24px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.difficultyLabel);

    this.puzzleNameLabel = new Arcadia.Label({
        position: { x: 0, y: 220 },
        font: '24px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.puzzleNameLabel);

    this.updatePageLabel();

    // Create two "pages" of thumbnail previews
    this.thumbnails = [[], []];

    // Store the default coords of each thumbnail (used for resetting after animations, etc.)
    this.thumbnailPositions = [];

    this.thumbnails.forEach(function (page) {
        var thumbnail,
            thumbnailIndex,
            index,
            previewPadding = 14;

        while (page.length < self.perPage) {
            thumbnailIndex = page.length;
            index = self.currentPage * self.perPage + thumbnailIndex;

            self.thumbnailPositions[thumbnailIndex] = {
                x: -(Thumbnail.SIZE + previewPadding) + (thumbnailIndex % 3) * (Thumbnail.SIZE + previewPadding),
                y: -(Thumbnail.SIZE + previewPadding) + Math.floor(thumbnailIndex / 3) * (Thumbnail.SIZE + previewPadding)
            };

            thumbnail = new Thumbnail({
                position: {
                    x: self.thumbnailPositions[thumbnailIndex].x,
                    y: self.thumbnailPositions[thumbnailIndex].y
                }
            });

            thumbnail.drawPreview(index, self.completedLevels);

            self.add(thumbnail);
            page.push(thumbnail);
        }
    });

    // Move second page offscreen
    this.thumbnails[1].forEach(function (thumbnail) {
        thumbnail.position = {
            x: thumbnail.position.x + self.size.width,
            y: thumbnail.position.y
        };
    });

    this.activeThumbnailPage = 0;

    // Highlight the selected level thumbnail
    this.previousThumbnail = this.thumbnails[this.activeThumbnailPage][this.selectedLevel - this.currentPage * this.perPage];
    this.previousThumbnail.highlight();

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

    if (Arcadia.isLocked()) {
        unlockButton = new Arcadia.Button({
            position: { x: this.size.width / 2 - 70, y: -this.size.height / 2 + 30 },
            size: { width: 110, height: 35 },
            border: '5px black',
            color: '#665945',
            shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
            label: new Arcadia.Label({
                text: 'unlock',
                color: 'white',
                font: '24px uni_05_53',
                position: { x: 0, y: -2.5 }
            }),
            action: function () {
                sona.play('button');
                Arcadia.changeScene(UnlockScene);
            }
        });
        this.add(unlockButton);
    }

    title = new Arcadia.Label({
        text: 'Choose\nPuzzle',
        font: '48px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 100 }
    });
    this.add(title);

    playButton = new Arcadia.Button({
        position: { x: 0, y: this.size.height / 2 - 50 },
        size: { width: 175, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'play',
            color: 'white',
            font: '32px uni_05_53',
            position: { x: 0, y: -5 }
        }),
        action: function () {
            sona.play('button');
            if (Arcadia.isLocked() && self.selectedLevel >= Arcadia.FREE_LEVEL_COUNT) {
                Arcadia.changeScene(UnlockScene);
            } else {
                Arcadia.changeScene(GameScene, { level: self.selectedLevel });
            }
        }
    });
    this.add(playButton);

    // Create previous/next buttons
    this.previousButton = new Arcadia.Button({
        position: { x: -this.size.width / 2 + 30, y: 195 },
        size: { width: 45, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '<',
            font: '40px uni_05_53',
            position: { x: 0, y: -4 }
        }),
        action: function () {
            self.previous();
        }
    });

    this.nextButton = new Arcadia.Button({
        position: { x: this.size.width / 2 - 30, y: 195 },
        size: { width: 45, height: 45 },
        color: '#665945',
        border: '5px black',
        shadow: '8px 8px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '>',
            font: '40px uni_05_53',
            position: { x: 0, y: -4 }
        }),
        action: function () {
            self.next();
        }
    });

    this.add(this.previousButton);
    this.add(this.nextButton);

    if (this.currentPage === this.totalPages - 1) {
        this.nextButton.disabled = true;
        this.nextButton.alpha = 0.5;
    }

    if (this.currentPage === 0) {
        this.previousButton.disabled = true;
        this.previousButton.alpha = 0.5;
    }
};

LevelSelectScene.prototype = new Arcadia.Scene();

LevelSelectScene.prototype.next = function () {
    var offset = -Arcadia.WIDTH,
        thumbnail,
        self = this;

    if (this.currentPage < this.totalPages - 1) {
        sona.play('button');
        this.nextButton.disabled = true;
        this.nextButton.alpha = 0.5;

        // Move (old) current page to the left
        this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
            var delay = Math.floor(index / 3) * LevelSelectScene.TRANSITION_DELAY;
            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        // increment currentPage
        this.currentPage += 1;

        // Toggle this var between 0 and 1
        this.activeThumbnailPage = this.activeThumbnailPage === 1 ? 0 : 1;

        // Move (new) current page to the left
        this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
            var delay,
                levelIndex;

            // Move offscreen to the right
            shape.position = {
                x: self.thumbnailPositions[index].x - offset,
                y: shape.position.y
            };

            levelIndex = self.currentPage * self.perPage + index;
            shape.drawPreview(levelIndex, self.completedLevels);

            delay = Math.floor(index / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        thumbnail = this.thumbnails[this.activeThumbnailPage][0];
        thumbnail.highlight();
        this.previousThumbnail.lowlight();
        this.previousThumbnail = thumbnail;
        this.selectedLevel = this.currentPage * this.perPage;
        this.updatePageLabel();
        localStorage.setItem('selectedLevel', this.selectedLevel);

        window.setTimeout(function () {
            if (self.currentPage < self.totalPages - 1) {
                self.nextButton.disabled = false;
                self.nextButton.alpha = 1;
            }
        }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

        if (this.previousButton.alpha < 1) {
            this.previousButton.disabled = false;
            this.previousButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.previous = function () {
    var offset = Arcadia.WIDTH,
        thumbnail,
        self = this;

    if (this.currentPage > 0) {
        sona.play('button');
        this.previousButton.disabled = true;
        this.previousButton.alpha = 0.5;

        // Move (old) current page to the right
        this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
            var delay = Math.floor((self.perPage - index - 1) / 3) * LevelSelectScene.TRANSITION_DELAY;
            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        // decrement currentPage
        this.currentPage -= 1;

        // Toggle this var between 0 and 1
        this.activeThumbnailPage = this.activeThumbnailPage === 1 ? 0 : 1;

        // Move (new) current page to the right
        this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
            var delay,
                levelIndex;

            // Move offscreen to the left
            shape.position = {
                x: self.thumbnailPositions[index].x - offset,
                y: shape.position.y
            };

            levelIndex = self.currentPage * self.perPage + index;
            shape.drawPreview(levelIndex, self.completedLevels);

            delay = Math.floor((self.perPage - index - 1) / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        thumbnail = this.thumbnails[this.activeThumbnailPage][0];
        thumbnail.highlight();
        this.previousThumbnail.lowlight();
        this.previousThumbnail = thumbnail;
        this.selectedLevel = this.currentPage * this.perPage;
        this.updatePageLabel();
        localStorage.setItem('selectedLevel', this.selectedLevel);

        window.setTimeout(function () {
            if (self.currentPage > 0) {
                self.previousButton.disabled = false;
                self.previousButton.alpha = 1;
            }
        }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

        if (this.nextButton.alpha < 1) {
            self.previousButton.disabled = false;
            this.nextButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.updatePageLabel = function () {
    this.pageLabel.text = (this.currentPage + 1) + '/' + this.totalPages;
    this.puzzleLabel.text = 'Puzzle #' + (this.selectedLevel + 1);  // 0-based index
    this.difficultyLabel.text = 'Difficulty: ' + LEVELS[this.selectedLevel].difficulty;

    if (this.completedLevels[this.selectedLevel]) {
        this.puzzleNameLabel.text = LEVELS[this.selectedLevel].title;
    } else {
        this.puzzleNameLabel.text = '???';
    }
};

LevelSelectScene.prototype.onPointEnd = function (points) {
    Arcadia.Scene.prototype.onPointEnd.call(this, points);

    var self = this,
        cursor = {
            size: { width: 1, height: 1 },
            position: points[0]
        },
        thumbnails = this.thumbnails[this.activeThumbnailPage];

    // Determine if tap/click touched a thumbnail
    thumbnails.forEach(function (thumbnail, index) {
        if (thumbnail.collidesWith(cursor) && thumbnail.alpha === 1) {
            sona.play('button');

            thumbnail.highlight();
            self.previousThumbnail.lowlight();
            self.previousThumbnail = thumbnail;
            self.selectedLevel = self.currentPage * self.perPage + index;
            localStorage.setItem('selectedLevel', self.selectedLevel);
            self.updatePageLabel();
        }
    });
};

LevelSelectScene.TRANSITION_TYPE = 'cubicInOut';
LevelSelectScene.TRANSITION_DURATION = 400;
LevelSelectScene.TRANSITION_DELAY = 100;
LevelSelectScene.TOTAL_TRANSITION_DURATION = 600;
