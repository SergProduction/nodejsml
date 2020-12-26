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
exports.LabledCorpus = void 0;
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
var sum = function (arr) { return arr.reduce(function (acc, p) { return acc + p; }, 0); };
var product = function (arr) { return arr.reduce(function (acc, p) { return acc * p; }, 0.00001); };
var Counter = /** @class */ (function () {
    function Counter(target) {
        this.target = target || {}; // Object.create(null)
    }
    Counter.fromArray = function (arr) {
        var target = {};
        arr.forEach(function (key) {
            if (target[key]) {
                target[key] = target[key] + 1;
            }
            else {
                target[key] = 1;
            }
        });
        return new Counter(target);
    };
    Counter.prototype.count = function (key) {
        return this.target[key] || 0;
    };
    Counter.prototype.len = function () {
        return Object.keys(this.target).length;
    };
    Counter.prototype.map = function (fn) {
        var objectCounter = {};
        this.forEach(function (key, count, len) {
            objectCounter[key] = fn(key, count, len);
        });
        return new Counter(objectCounter);
    };
    Counter.prototype.forEach = function (fn) {
        var len = this.len();
        objMap(this.target, function (key, count) { return fn(key, count, len); });
    };
    Counter.prototype.merge = function (counter) {
        var fullTarget = {};
        var targets = [this.target, counter.target];
        targets.forEach(function (target) {
            Object.entries(target).forEach(function (_a) {
                var key = _a[0], count = _a[1];
                fullTarget[key] = fullTarget[key] !== undefined
                    ? fullTarget[key] + count
                    : count;
            });
        });
        return new Counter(fullTarget);
    };
    return Counter;
}());
// --- parse weigth ---
var getTokens = function (doc) {
    return doc.split(/\s+/);
};
var calcWeightDoc = function (count, len) { return 1; };
var calcWeightCorpus = function (count, len) { return count; };
var calcDocCounter = function (doc) {
    var tokens = getTokens(doc);
    var freqTok = Counter.fromArray(tokens);
    return freqTok.map(function (key, count, len) { return calcWeightDoc(count, len); });
};
var calcCorpusCounter = function (docsCounter) {
    var corpusCounter = docsCounter.reduce(function (acc, counter) { return acc.merge(counter); }, new Counter());
    return corpusCounter.map(function (key, count, len) { return calcWeightCorpus(count, len); });
};
// corpusCounter(hsCorpus);
/*
export type Label = string;
export type LabeledDocs = Record<Label, string[]>;
export type DictCorpusCounter = Record<Label, Counter>;
// state = {[key: label]: CorpusesTF}

export const dictCorpusCounter = (corpuses: LabeledDocs): DictCorpusCounter => {
  const corpusesTF: DictCorpusCounter = {};
  Object.keys(corpuses).forEach((label) => {
    corpusesTF[label] = calcCorpusCounter(corpuses[label]);
  });
  return corpusesTF;
};
 */
/*
export const getTop = (corpusesTF: CorpusesTF, count: number) => {
  const filtredCorpusesTF: CorpusesTF = {};
  Object.keys(corpusesTF).forEach((label) => {
    const corpusTF = corpusesTF[label];
    filtredCorpusesTF[label] = Object.fromEntries(
      Object.entries(corpusTF)
        .sort(([k1, v1], [k2, v2]) => v2 - v1) // 99,98,97
        .slice(0, count),
    );
  });
  return filtredCorpusesTF;
};
*/
var LabledCorpus = /** @class */ (function () {
    function LabledCorpus() {
        this.state = {};
        this.normalized = [];
    }
    LabledCorpus.prototype.push = function (label, corpus) {
        var newCorpusCounter = calcCorpusCounter(corpus.map(calcDocCounter));
        if (!this.state.hasOwnProperty(label)) {
            this.state[label] = {
                docLen: 0,
                corpusCounter: new Counter()
            };
        }
        var _a = this.state[label], docLen = _a.docLen, corpusCounter = _a.corpusCounter;
        this.state[label].docLen = docLen + corpus.length;
        this.state[label].corpusCounter = corpusCounter.merge(newCorpusCounter);
    };
    LabledCorpus.prototype.scalleByDocLen = function (label) {
        var _a = this.state[label], docLen = _a.docLen, corpusCounter = _a.corpusCounter;
        return corpusCounter.map(function (_, count) { return count / docLen; });
    };
    LabledCorpus.prototype.normalize = function () {
        var _this = this;
        this.normalized = Object.keys(this.state)
            .map(function (label) { return ({
            label: label,
            corpusCounter: _this.scalleByDocLen(label)
        }); });
    };
    LabledCorpus.prototype.debugLog = function (doc) { };
    LabledCorpus.prototype.predictLabel = function (doc) {
        var docTokens = getTokens(doc);
        var result = this.normalized.map(function (_a) {
            var label = _a.label, corpusCounter = _a.corpusCounter;
            return ({
                label: label,
                weight: sum(docTokens.map(function (word) { return corpusCounter.count(word); }))
            });
        }).sort(function (a, b) { return b.weight - a.weight; });
        console.log(result);
    };
    return LabledCorpus;
}());
exports.LabledCorpus = LabledCorpus;
