var action = Arcadia.ENV.mobile ? 'Tap' : 'Click';

var TUTORIALS = [
    // level 1 (0 index)
    {
        // blocks that need to be filled before moving on
        indices: [
            [0, 5, 10, 15, 20],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5]
        ],
        // Where hints are displayed to player
        hints: [
            { position: { x: 36.5, y: 33.5 }, size: { width: 109.5, height: 109.5 } },
            { position: { x: 36.5, y: 124.75 }, size: { width: 109.5, height: 73 } },
            { position: { x: -54.75, y: 124.75 }, size: { width: 73, height: 73 } },
            { position: { x: -54.75, y: 33.5 }, size: { width: 73, height: 109.5 } }
        ],
        // text displayed to player
        text: [
            //'This is text which can be used\nfor a hint in the hint text area.',
            'This is text which can be used\nfor a hint in the hint text area.',
            action + ' and drag to\ndraw a rectangle on\ntop of each number.',
            'Each number\nequals the area\nof its rectangle.',
            'Rectangles cover\nonly one number.',
            'Rectangles\ncan\'t overlap!'
        ]
    }
];
