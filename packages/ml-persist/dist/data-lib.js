"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = exports.product = exports.sum = exports.objLen = exports.objForEach = exports.objMap = void 0;
var objMap = function (obj, fn) { return (Object.fromEntries(Object.entries(obj).map(function (_a) {
    var _b = __read(_a, 2), k = _b[0], v = _b[1];
    return ([
        k,
        fn(k, v)
    ]);
}))); };
exports.objMap = objMap;
var objForEach = function (obj, fn) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        fn(key, obj[key]);
    }
};
exports.objForEach = objForEach;
var objLen = function (obj) {
    return Object.keys(obj).length;
};
exports.objLen = objLen;
var sum = function (arr) { return arr.reduce(function (acc, p) { return acc + p; }, 0); };
exports.sum = sum;
var product = function (arr) { return arr.reduce(function (acc, p) { return acc * p; }, 0.00001); };
exports.product = product;
/*
считает кол-во одинаковых строк в массиве
*/
var Counter = /** @class */ (function () {
    function Counter(target) {
        this.target = target || {}; // Object.create(null)
    }
    /**
     * returned new Counter
     */
    Counter.fromArray = function (arr) {
        var target = {};
        arr
            .sort(function (a, b) { return a.localeCompare(b); })
            .forEach(function (key) {
            if (target[key]) {
                target[key] = target[key] + 1;
            }
            else {
                target[key] = 1;
            }
        });
        return new Counter(target);
    };
    Counter.prototype.toObject = function () {
        return this.target;
        // .sort(([k0,v0], [k1,v1]) => v0 > v1 ? 1 : 0 )
        // .reduce((acc, [k,v]) => ({ ...acc, [k]: v}), {})
    };
    /**
     * return conut by key
     * @param isSort is not required
     */
    Counter.prototype.toArray = function (isSort) {
        var result = Object.entries(this.target);
        return isSort
            ? result.sort(function (_a, _b) {
                var _c = __read(_a, 2), k0 = _c[0], v0 = _c[1];
                var _d = __read(_b, 2), k1 = _d[0], v1 = _d[1];
                return v1 - v0;
            })
            : result;
    };
    Counter.prototype.set = function (key, count) {
        this.target[key] = count;
    };
    /**
     * return conut by key
     */
    Counter.prototype.count = function (key) {
        return this.target[key] || 0;
    };
    /**
     * return keys length Counter
     */
    Counter.prototype.len = function () {
        return Object.keys(this.target).length;
    };
    /**
     * immutable iterable, return new Counter
     */
    Counter.prototype.map = function (fn) {
        var objectCounter = {};
        this.forEach(function (key, count, len) {
            objectCounter[key] = fn(key, count, len);
        });
        return new Counter(objectCounter);
    };
    /**
     * mutable iterable
     */
    Counter.prototype.forEach = function (fn) {
        var len = this.len();
        Object.entries(this.target).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], count = _b[1];
            fn(key, count, len);
        });
    };
    /**
     * immutable joined A Counter from B Counter and return new Counter
     */
    Counter.prototype.concat = function (counter) {
        var fullTarget = {};
        var targets = [this.target, counter.target];
        targets.forEach(function (target) {
            Object.entries(target).forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], count = _b[1];
                fullTarget[key] = fullTarget[key] !== undefined
                    ? fullTarget[key] + count
                    : count;
            });
        });
        return new Counter(fullTarget);
    };
    /**
     * mutable joined A Counter from B Counter
     */
    Counter.prototype.extend = function (counter) {
        var _this = this;
        counter.forEach(function (key, count) {
            _this.target[key] = _this.target[key]
                ? _this.target[key] + count
                : count;
        });
        return this;
    };
    return Counter;
}());
exports.Counter = Counter;
