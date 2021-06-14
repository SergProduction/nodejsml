"use strict";
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
exports.ManyTF = exports.TF = void 0;
var lib_1 = require("./lib");
var TF = /** @class */ (function () {
    function TF(tfDocs, tfCorpus) {
        this.handleCalcDoc = function (count, len) { return count; };
        this.handleCalcCorpus = function (count, len) { return count; };
        this.docs = tfDocs || [];
        this.corpus = tfCorpus || new lib_1.Counter();
    }
    TF.fromObject = function (data) {
        var docs = data.docs.map(function (d) { return new lib_1.Counter(d); });
        var corpus = new lib_1.Counter(data.corpus);
        return new TF(docs, corpus);
    };
    TF.prototype.toObject = function () {
        return {
            docs: this.docs.map(function (v) { return v.toObject(); }),
            corpus: this.corpus.toObject(),
        };
    };
    TF.getTerms = function (doc) {
        // const regexp = /\s+/
        // const regexp = /(\w+)/
        var regexp = /(\w+|&|!|=|<|>|{|}|\[|\]|\(|\)|\+|-|@|\$|\*|\/|\?|"|'|,|;)/;
        // const f = ['=','<','>','{','}', '(', ')', '[', ']']
        return doc
            .split(regexp)
            .filter(function (t) {
            return t !== ''
                && /\d+/.test(t) === false
                && /^\s+$/.test(t) === false;
        })
            .map(function (t) {
            if (t.indexOf('$') === 0) {
                return '/$';
            }
            if (t.indexOf('.') !== -1) {
                return t.split('').map(function (w) { return w === '.' ? '^' : w; }).join('');
            }
            return t;
        })
            .reduce(function (acc, it) {
            var last = acc[acc.length - 1];
            var ngramm = last.length < 3
                ? last + it
                : it;
            acc.push(ngramm);
            return acc;
        }, ['']);
    };
    TF.prototype.addCorpus = function (corpus) {
        var _this = this;
        corpus.forEach(function (doc) { return _this.addDoc(doc); });
    };
    TF.prototype.addDoc = function (doc) {
        var terms = TF.getTerms(doc);
        var tfDoc = lib_1.Counter.fromArray(terms);
        this.docs.push(tfDoc);
        this.corpus.extend(tfDoc);
    };
    TF.prototype.calcWeigths = function (handleCalcDoc, handleCalcCorpus, isImmutable) {
        var _this = this;
        var calcWeigthDoc = handleCalcDoc || this.handleCalcDoc;
        var calcWeigthCorpus = handleCalcCorpus || this.handleCalcCorpus;
        var newTfDocs = this.docs.map(function (doc) { return doc.map(function (key, count, len) { return calcWeigthDoc(count, len); }); });
        var rawTfCorpus = newTfDocs.reduce(function (corpus, doc) { return corpus.extend(doc); }, new lib_1.Counter());
        var newTfCorpus = rawTfCorpus.map(function (key, count, len) { return calcWeigthCorpus(count, len, _this.docs.length); });
        if (isImmutable) {
            var newTF = new TF(newTfDocs, newTfCorpus);
            newTF.handleCalcDoc = calcWeigthDoc;
            newTF.handleCalcCorpus = calcWeigthCorpus;
            return newTF;
        }
        this.docs = newTfDocs;
        this.corpus = newTfCorpus;
    };
    return TF;
}());
exports.TF = TF;
var ManyTF = /** @class */ (function () {
    function ManyTF(initState) {
        this.state = initState || {};
        this.handleCalcDoc = function () { return 1; };
        this.handleCalcCorpus = function (count, len, docLen) { return count / docLen; };
        this.log = false;
    }
    ManyTF.fromObject = function (data) {
        var result = lib_1.objMap(data, function (label, tfData) { return TF.fromObject(tfData); });
        return new ManyTF(result);
    };
    ManyTF.prototype.toObject = function () {
        return lib_1.objMap(this.state, function (k, v) { return v.toObject(); });
    };
    ManyTF.prototype.addCorpus = function (label, corpus) {
        if (this.log)
            console.time("addCorpus " + label);
        if (!this.state[label]) {
            this.state[label] = new TF();
        }
        this.state[label].addCorpus(corpus);
        if (this.log)
            console.timeEnd("addCorpus " + label);
    };
    ManyTF.prototype.calcWeigths = function (handleCalcDoc, handleCalcCorpus, isImmutable) {
        var _this = this;
        if (this.log)
            console.time('calcWeigths');
        var calcDoc = handleCalcDoc || this.handleCalcDoc;
        var calcCorpus = handleCalcCorpus || this.handleCalcCorpus;
        var newManyTf = Object.keys(this.state).reduce(function (acc, label) {
            var _a;
            var tf = _this.state[label];
            var newTf = tf.calcWeigths(calcDoc, calcCorpus, true);
            return __assign(__assign({}, acc), (_a = {}, _a[label] = newTf, _a));
        }, {});
        if (isImmutable) {
            var newManyTF = new ManyTF(newManyTf);
            newManyTF.handleCalcDoc = calcDoc;
            newManyTF.handleCalcCorpus = calcCorpus;
            return newManyTF;
        }
        this.state = newManyTf;
        if (this.log)
            console.timeEnd('calcWeigths');
    };
    ManyTF.prototype.predictLabel = function (doc) {
        var _this = this;
        if (this.log)
            console.time('predictLabel');
        var docTerms = TF.getTerms(doc);
        var docWeigthsByCorpus = Object.keys(this.state).map(function (label) { return ({
            label: label,
            weights: docTerms.map(function (term) { return _this.state[label].corpus.count(term); })
        }); });
        var tryPredict = docWeigthsByCorpus.map(function (t) { return ({
            label: t.label,
            weight: lib_1.sum(t.weights)
        }); }).sort(function (a, b) { return b.weight - a.weight; });
        if (this.log)
            console.timeEnd('predictLabel');
        return tryPredict;
    };
    return ManyTF;
}());
exports.ManyTF = ManyTF;
