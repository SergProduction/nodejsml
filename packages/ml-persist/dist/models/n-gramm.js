"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.NGramm = void 0;
var data_lib_1 = require("../data-lib");
var model_1 = require("../model");
var NGramm = /** @class */ (function (_super) {
    __extends(NGramm, _super);
    function NGramm(n) {
        var _this = _super.call(this) || this;
        _this.n = n || 2;
        _this.model = new data_lib_1.Counter();
        _this.separator = '➕';
        return _this;
    }
    NGramm.toNGramm = function (rowData, n) {
        var allRowNGramm = [];
        for (var i = 0; i < rowData.length; i++) {
            var ngramm = rowData.slice(i, i + n);
            if (ngramm.length < n)
                continue;
            allRowNGramm.push(ngramm);
        }
        return allRowNGramm;
    };
    NGramm.prototype.encode = function () {
        var _this = this;
        var arrJoinedNGrmam = this.model.toArray(true);
        var output = arrJoinedNGrmam.map(function (_a) {
            var _b = __read(_a, 2), joinedNGrmam = _b[0], count = _b[1];
            return [
                joinedNGrmam.split(_this.separator),
                count
            ];
        });
        return output;
    };
    NGramm.prototype.decode = function (modelData) {
        var _this = this;
        this.model = data_lib_1.Counter.fromArray(modelData.map(function (ngramm) { return ngramm.join(_this.separator); }));
    };
    NGramm.prototype.getTerms = function (doc) {
        return doc
            .split(/([а-я]+)/i)
            .filter(function (t) {
            return t !== ''
                && t.length > 2
                && /\d+/.test(t) === false
                && /^\s+$/.test(t) === false;
        })
            .map(function (word) { return word.toLowerCase(); });
    };
    NGramm.prototype.addNramm = function (rowData) {
        var _this = this;
        var terms = this.getTerms(rowData);
        var f = NGramm.toNGramm(terms, this.n);
        // console.log();
        var counterNgramm = data_lib_1.Counter.fromArray(f.map(function (ngramm) { return ngramm.join(_this.separator); }));
        this.model.extend(counterNgramm);
    };
    NGramm.prototype.learn = function () { };
    NGramm.prototype.predict = function () { };
    return NGramm;
}(model_1.Model));
exports.NGramm = NGramm;
