"use strict";
// --- lib ---
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
exports.Parse = exports.getTop = exports.corpusesFreq = void 0;
var objMap = function (obj, fn) {
    return Object.entries(obj).reduce(function (acc, _a) {
        var _b;
        var k = _a[0], v = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[k] = fn(k, v), _b)));
    }, {});
};
var objLen = function (obj) {
    return Object.keys(obj).length;
};
// --- parse weigth ---
var getTokens = function (doc) {
    return doc.split(/\s+/);
};
var calcWeightDoc = function (tf, all) { return 1; };
var calcWeightCorpus = function (tf, all) { return tf; };
var calcWeight = function (freqDict, calcFn) {
    return objMap(freqDict, function (k, v) { return calcFn(v, objLen(freqDict)); });
};
var docTF = function (doc) {
    var tokens = getTokens(doc);
    var freqTok = {};
    tokens.forEach(function (t) {
        if (freqTok[t]) {
            freqTok[t] = freqTok[t] + 1;
        }
        else {
            freqTok[t] = 1;
        }
    });
    return calcWeight(freqTok, calcWeightDoc);
};
var corpusTF = function (corpus) {
    var docsFreq = corpus.map(function (doc) { return docTF(doc); });
    var corpusFreq = {};
    docsFreq.forEach(function (docFreq) {
        Object.keys(docFreq).forEach(function (docWorld) {
            if (corpusFreq[docWorld]) {
                corpusFreq[docWorld] = corpusFreq[docWorld] + docFreq[docWorld];
            }
            else {
                corpusFreq[docWorld] = docFreq[docWorld];
            }
        });
    });
    return calcWeight(corpusFreq, calcWeightCorpus);
};
// state = {[key: label]: CorpusesTF}
exports.corpusesFreq = function (corpuses) {
    var corpusesTF = {};
    Object.keys(corpuses).forEach(function (label) {
        corpusesTF[label] = corpusTF(corpuses[label]);
    });
    return corpusesTF;
};
exports.getTop = function (corpusesTF, count) {
    var filtredCorpusesTF = {};
    Object.keys(corpusesTF).forEach(function (label) {
        var corpusTF = corpusesTF[label];
        filtredCorpusesTF[label] = Object.fromEntries(Object.entries(corpusTF)
            .sort(function (_a, _b) {
            var k1 = _a[0], v1 = _a[1];
            var k2 = _b[0], v2 = _b[1];
            return v2 - v1;
        }) // 99,98,97
            .slice(0, count));
    });
    return filtredCorpusesTF;
};
var Parse = /** @class */ (function () {
    function Parse(state) {
        if (state === void 0) { state = {}; }
        this.state = {};
    }
    Parse.prototype.getState = function () {
        return this.state;
    };
    /*
    add(p: Parse) {
      Object.keys(p.state).forEach((label) => {
        this.merge(label, p.state[label]);
      });
    } */
    Parse.prototype.push = function (label, corpus) {
        var result = corpusTF(corpus);
        this.merge(label, result, corpus.length);
    };
    Parse.prototype.merge = function (label, corpusTF, docCount) {
        var acc = this.state[label];
        if (acc) {
            acc.docCount += docCount;
            acc.tf = objMap(acc.tf, function (k, v) { return corpusTF[k]
                ? v + corpusTF[k]
                : v; });
        }
        else {
            this.state[label] = {
                docCount: docCount,
                tf: corpusTF
            };
        }
    };
    Parse.prototype.print = function () { };
    Parse.prototype.predictLabel = function (doc) {
        var _this = this;
        var docTok = getTokens(doc);
        var labelsMap = Object.keys(this.state).map(function (label) {
            return {
                label: label,
                weigth: docTok.map(function (word) { return ({
                    word: word,
                    tf: _this.state[label].tf[word] || 0
                }); })
            };
        });
        labelsMap.forEach(function (doc) {
            console.log(doc.label, _this.state[doc.label].docCount, sum(doc.weigth.map(function (p) { return p.tf; })), sum(doc.weigth.map(function (p) { return p.tf; })) / _this.state[doc.label].docCount);
        });
        var productLabels = labelsMap.map(function (doc) { return ({
            label: doc.label,
            // docCount: this.state[doc.label].docCount,
            // pp: sum(doc.weigth.map(p => p.tf)),
            product: sum(doc.weigth.map(function (p) { return p.tf; })) / _this.state[doc.label].docCount
        }); }).sort(function (a, b) { return b.product - a.product; });
        console.log({ productLabels: productLabels });
        // const result = productLabels.reduce((p, n) => p > n ? p : n);
        return;
    };
    return Parse;
}());
exports.Parse = Parse;
var sum = function (arr) { return arr.reduce(function (acc, p) { return acc + p; }, 0); };
var product = function (arr) { return arr.reduce(function (acc, p) { return acc * p; }, 0.00001); };
