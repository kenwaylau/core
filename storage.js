/**
 * Storage Module
 * 
 */
define(function (require, exports, module) {
    'use strict';

    var hasLocalStorage,
        storage,
        _storage = {};

    try {
        hasLocalStorage = ('localStorage' in window) &&
            localStorage !== null;
    } catch (e) {
        hasLocalStorage = false;
    }

    storage = {
        hasLocalStorage: hasLocalStorage,

        get: function (key) {
            var obj;

            if (this.hasLocalStorage) {
                var value = localStorage.getItem(key);
                try {
                    obj = JSON.parse(value);
                } catch (e) {
                    obj = value;
                }
            } else {
                obj = _storage[key];
            }

            if (obj && obj.data) {
                if (!('expire' in obj) || obj.expire > Date.now()) {
                    return obj.data;
                }
                this.remove(key);
            }
            return null;
        },

        set: function (key, value, expire) {
            var obj = {
                data: value
            };
            if (expire > 0) {
                obj.expire = Date.now() + expire * 1000;
            }

            if (this.hasLocalStorage) {
                localStorage.setItem(key, JSON.stringify(obj));
            } else {
                _storage[key] = obj;
            }
            return value;
        },

        remove: function (key) {
            if (this.hasLocalStorage) {
                localStorage.removeItem(key);
            } else {
                delete _storage[key];
            }
        },

        removeExpired: function () {
            Object.keys(localStorage).forEach(function (key) {
                this.get(key);
            }, storage);
        }
    };

    if (hasLocalStorage) {
        storage.removeExpired();
    }

    module.exports = storage;
});