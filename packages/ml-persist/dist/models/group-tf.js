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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupTF = void 0;
var data_lib_1 = require("../data-lib");
var model_1 = require("../model");
var tf_1 = require("./tf");
var GroupTF = /** @class */ (function (_super) {
    __extends(GroupTF, _super);
    function GroupTF(initState) {
        var _this = _super.call(this) || this;
        _this.state = initState || {};
        _this.handleCalcDoc = function () { return 1; };
        _this.handleCalcCorpus = function (count, len, docLen) { return count / docLen; };
        _this.log = false;
        return _this;
    }
    GroupTF.prototype.decode = function (data) {
        // console.log(data);
        this.state = data_lib_1.objMap(data, function (label, tfData) {
            var tf = new tf_1.TF();
            tf.decode(tfData);
            return tf;
        });
    };
    GroupTF.prototype.encode = function () {
        return data_lib_1.objMap(this.state, function (k, v) { return v.encode(); });
    };
    GroupTF.prototype.addGroup = function (rowData) {
        var _this = this;
        data_lib_1.objForEach(rowData, function (label, corpus) { return _this.addCorpus(label, corpus); });
    };
    GroupTF.prototype.addCorpus = function (label, corpus) {
        if (this.log)
            console.time("addCorpus " + label);
        if (!this.state[label]) {
            this.state[label] = new tf_1.TF();
        }
        this.state[label].addCorpus(corpus);
        if (this.log)
            console.timeEnd("addCorpus " + label);
    };
    GroupTF.prototype.learn = function (handleCalcDoc, handleCalcCorpus, isImmutable) {
        var _this = this;
        if (this.log)
            console.time('calcWeigths');
        var calcDoc = handleCalcDoc || this.handleCalcDoc;
        var calcCorpus = handleCalcCorpus || this.handleCalcCorpus;
        var newGroupTf = Object.keys(this.state).reduce(function (acc, label) {
            var _a;
            var tf = _this.state[label];
            var newTf = tf.learn(calcDoc, calcCorpus, true);
            return __assign(__assign({}, acc), (_a = {}, _a[label] = newTf, _a));
        }, {});
        if (isImmutable) {
            var newGroupTF = new GroupTF(newGroupTf);
            newGroupTF.handleCalcDoc = calcDoc;
            newGroupTF.handleCalcCorpus = calcCorpus;
            return newGroupTF;
        }
        this.state = newGroupTf;
        if (this.log)
            console.timeEnd('calcWeigths');
    };
    GroupTF.prototype.predict = function (doc) {
        var _this = this;
        if (this.log)
            console.time('predictLabel');
        var docTerms = (new tf_1.TF).getTerms(doc);
        var docWeigthsByCorpus = Object.keys(this.state).map(function (label) { return ({
            label: label,
            weights: docTerms.map(function (term) { return _this.state[label].corpus.count(term); })
        }); });
        var tryPredict = docWeigthsByCorpus.map(function (t) { return ({
            label: t.label,
            weight: data_lib_1.sum(t.weights)
        }); }).sort(function (a, b) { return b.weight - a.weight; });
        if (this.log)
            console.timeEnd('predictLabel');
        return tryPredict;
    };
    return GroupTF;
}(model_1.Model));
exports.GroupTF = GroupTF;
