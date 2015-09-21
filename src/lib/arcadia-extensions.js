Arcadia.isLocked = function () {
    return window.store !== undefined && localStorage.getBoolean('unlocked') === false;
};
