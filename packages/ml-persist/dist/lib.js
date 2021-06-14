"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = exports.loadSample = exports.product = exports.sum = exports.objLen = exports.objForEach = exports.objMap = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
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
var loadSample = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var fileBuffer, fileString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, util_1.promisify(fs_1.default.readFile)(path_1.default.join(__dirname, "../sample/" + key + ".json"))];
            case 1:
                fileBuffer = _a.sent();
                fileString = fileBuffer.toString();
                return [2 /*return*/, JSON.parse(fileString)];
        }
    });
}); };
exports.loadSample = loadSample;
/*
считает кол-во одинаковых строк в массиве
*/
var Counter = /** @class */ (function () {
    function Counter(target) {
        this.target = target || {}; // Object.create(null)
    }
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
    Counter.prototype.set = function (key, count) {
        this.target[key] = count;
    };
    Counter.prototype.count = function (key) {
        return this.target[key] || 0;
    };
    Counter.prototype.len = function () {
        return Object.keys(this.target).length;
    };
    // immutable
    Counter.prototype.map = function (fn) {
        var objectCounter = {};
        this.forEach(function (key, count, len) {
            objectCounter[key] = fn(key, count, len);
        });
        return new Counter(objectCounter);
    };
    // iter
    Counter.prototype.forEach = function (fn) {
        var len = this.len();
        Object.entries(this.target).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], count = _b[1];
            fn(key, count, len);
        });
    };
    // immutable
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
    // mutable
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
