var action = Arcadia.ENV.mobile ? 'tap' : 'click';
var actionGerund = Arcadia.ENV.mobile ? 'tapping' : 'clicking';
var TUTORIALS = [
    /* LEVEL 1 */
    {
        // blocks that need to be filled before moving on
        indices: [
            [0, 5, 10, 15, 20],
            [1, 2, 3],
            [21, 22, 23],
            [13, 18],
            [12],
            [99]
        ],
        // Where hints are displayed to player
        hints: [
            { position: { x: 5, y: 133 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 5 } },
            { position: { x: 57, y: 81 }, size: { width: Grid.CELL_SIZE * 3, height: Grid.CELL_SIZE } },
            { position: { x: 57, y: 185 }, size: { width: Grid.CELL_SIZE * 3, height: Grid.CELL_SIZE } },
            { position: { x: 83, y: 146 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 2 } },
            { position: { x: 57, y: 133 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE } }
        ],
        // text displayed to player
        text: [
            'Nonograms are logic puzzles.\nFill in blocks to reveal hidden\npictures. Start by ' + actionGerund + ' the\nfive highlighted blocks.',
            'The numbers are clues. They\ntell how many consecutive\nfilled blocks are in a row\nor column.',
            'Since the entire first\ncolumn is filled, it\'s\neasier to solve each row.',
            'Use the `mark` button\nto show a block is supposed\nto remain empty.',
            'Use logic to figure out\nwhich blocks to mark.\nGood luck!',
            'Great job!'
        ]
    },
    /* LEVEL 2*/
    {
        // blocks that need to be filled before moving on
        indices: [
            [0, 5, 10, 15, 20],
            [21, 22, 23, 24],
            [6, 11, 16],
            [12, 17],
            [18],
            [99]
        ],
        // Where hints are displayed to player
        hints: [
            { position: { x: 6, y: 133 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 5 } },
            { position: { x: 70, y: 185 }, size: { width: Grid.CELL_SIZE * 4, height: Grid.CELL_SIZE } },
            { position: { x: 6 + Grid.CELL_SIZE * 1, y: 133 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 3 } },
            { position: { x: 6 + Grid.CELL_SIZE * 2, y: 146 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 2 } },
            { position: { x: 6 + Grid.CELL_SIZE * 3, y: 161 }, size: { width: Grid.CELL_SIZE, height: Grid.CELL_SIZE * 1 } }
        ],
        // text displayed to player
        text: [
            'Start with obvious clues.\nThis grid is 5x5, so a clue of\n`5` fills the entire column.',
            'The `5` clue for the\nlast row is also easy.\nFill the whole row!',
            'Next, work on the rows or\ncolumns that begin at\nthe edge of the puzzle grid.',
            'If row clues aren\'t\nhelping, try looking\nat the column clues.',
            'Dimmed clues mean\nthat a row or column \nis complete.',
            'Great job!'
        ]
    }
];
