(function () {
    Storage.namespace = 'shikaku';

    var originalGetItem = Storage.prototype.getItem,
        originalSetItem = Storage.prototype.setItem;

    Storage.prototype.setItem = function (key, value) {
        key = this.namespace(key);
        return originalSetItem.apply(this, arguments);
    };

    Storage.prototype.getItem = function (key) {
        key = this.namespace(key);
        return originalGetItem.apply(this, arguments);
    };

    Storage.prototype.namespace = function (key) {
        return Storage.namespace + ':' + key;
    };

    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);

        if (value) {
            return JSON.parse(value);
        }

        return null;
    };

    Storage.prototype.setBoolean = function (key, value) {
        this.setItem(key, !!value);
    };

    Storage.prototype.getBoolean = function (key) {
        return this.getItem(key) == 'true';
    };
})();
