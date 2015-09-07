/*jslint sloppy: true */
/*globals Arcadia, window, console, localStorage, sona, LEVELS,
GameScene, TitleScene, Thumbnail */

var LevelSelectScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    options = options || {};

    var title,
        backButton,
        playButton,
        self = this;

    this.selectedLevel = 0;
    this.currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 0;
    this.perPage = 9;
    this.totalPages = Math.ceil(LEVELS.length / this.perPage);
    this.completed = localStorage.getObject('completed') || Array(LEVELS.length);

    this.pageLabel = new Arcadia.Label({
        position: { x: 0, y: -290 },
        font: '32px uni_05_53',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.pageLabel);

    this.puzzleLabel = new Arcadia.Label({
        position: { x: 0, y: 320 },
        font: '48px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.puzzleLabel);

    this.difficultyLabel = new Arcadia.Label({
        position: { x: 0, y: 380 },
        font: '48px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)'
    });
    this.add(this.difficultyLabel);

    this.puzzleNameLabel = new Arcadia.Label({
        position: { x: 0, y: 440 },
        font: '48px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)'
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
            previewPadding = 25;

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

            thumbnail.drawPreview(index, self.completed);

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

    title = new Arcadia.Label({
        text: 'Choose\nPuzzle',
        font: '96px uni_05_53',
        shadow: '10px 10px 0 rgba(0, 0, 0, 0.5)',
        position: { x: 0, y: -this.size.height / 2 + 200 }
    });
    this.add(title);

    playButton = new Arcadia.Button({
        position: { x: 0, y: this.size.height / 2 - 100 },
        size: { width: 350, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'play',
            color: 'white',
            font: '64px uni_05_53',
            position: { x: 0, y: -10 }
        }),
        action: function () {
            sona.play('button');
            Arcadia.changeScene(GameScene, { level: self.selectedLevel });
        }
    });
    this.add(playButton);

    // Create previous/next buttons
    this.previousButton = new Arcadia.Button({
        position: { x: -this.size.width / 2 + 60, y: 390 },
        size: { width: 90, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '<',
            font: '80px uni_05_53',
            position: { x: 0, y: -8 }
        }),
        action: function () {
            self.previous();
        }
    });

    this.nextButton = new Arcadia.Button({
        position: { x: this.size.width / 2 - 60, y: 390 },
        size: { width: 90, height: 90 },
        color: '#665945',
        border: '10px black',
        shadow: '15px 15px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '>',
            font: '80px uni_05_53',
            position: { x: 0, y: -8 }
        }),
        action: function () {
            self.next();
        }
    });

    this.add(this.previousButton);
    this.add(this.nextButton);

    if (options.selectedLevel !== undefined) {
        this.selectedLevel = options.selectedLevel;
        this.thumbnails[this.selectedLevel - this.perPage * this.currentPage].highlight();
    }
};

LevelSelectScene.prototype = new Arcadia.Scene();

LevelSelectScene.prototype.next = function () {
    var offset = -Arcadia.WIDTH,
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
            shape.drawPreview(levelIndex, self.completed);

            delay = Math.floor(index / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        this.updatePageLabel();
        localStorage.setItem('currentPage', this.currentPage);

        window.setTimeout(function () {
            self.nextButton.disabled = false;
            if (self.currentPage < self.totalPages - 1) {
                self.nextButton.alpha = 1;
            }
        }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

        if (this.previousButton.alpha < 1) {
            this.previousButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.previous = function () {
    var offset = Arcadia.WIDTH,
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
            shape.drawPreview(levelIndex, self.completed);

            delay = Math.floor((self.perPage - index - 1) / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

            window.setTimeout(function () {
                shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
            }, delay);
        });

        this.updatePageLabel();
        localStorage.setItem('currentPage', this.currentPage);

        window.setTimeout(function () {
            self.previousButton.disabled = false;
            if (self.currentPage > 0) {
                self.previousButton.alpha = 1;
            }
        }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

        if (this.nextButton.alpha < 1) {
            this.nextButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.updatePageLabel = function () {
    this.pageLabel.text = (this.currentPage + 1) + '/' + this.totalPages;
    this.puzzleLabel.text = 'Puzzle #' + this.selectedLevel;
    this.difficultyLabel.text = 'Difficulty: ' + LEVELS[this.selectedLevel].difficulty;
    this.puzzleNameLabel.text = LEVELS[this.selectedLevel].title;
};

LevelSelectScene.prototype.onPointEnd = function (points) {
    var self = this,
        cursor = {
            size: { width: 1, height: 1 },
            position: points[0]
        };

    // Determine if tap/click touched a thumbnail
    this.thumbnails[this.activeThumbnailPage].forEach(function (thumbnail, index) {
        var selected = self.currentPage * self.perPage + index;

        thumbnail.lowlight();

        if (thumbnail.collidesWith(cursor)) {
            sona.play('button');

            thumbnail.highlight();

            self.selectedLevel = selected;

            self.updatePageLabel();
        }
    });
};

LevelSelectScene.TRANSITION_TYPE = 'cubicInOut';
LevelSelectScene.TRANSITION_DURATION = 400;
LevelSelectScene.TRANSITION_DELAY = 100;
LevelSelectScene.TOTAL_TRANSITION_DURATION = 600;
