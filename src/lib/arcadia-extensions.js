Arcadia.isLocked = function () {
    return window.store !== undefined && localStorage.getBoolean('unlocked') === false;
};

Arcadia.FREE_LEVEL_COUNT = 15;
