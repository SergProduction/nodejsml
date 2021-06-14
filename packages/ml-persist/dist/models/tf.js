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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TF = void 0;
var data_lib_1 = require("../data-lib");
var model_1 = require("../model");
var TF = /** @class */ (function (_super) {
    __extends(TF, _super);
    function TF(tfDocs, tfCorpus) {
        var _this = _super.call(this) || this;
        _this.handleCalcDoc = function (count, len) { return count; };
        _this.handleCalcCorpus = function (count, len) { return count; };
        _this.docs = tfDocs || [];
        _this.corpus = tfCorpus || new data_lib_1.Counter();
        return _this;
    }
    TF.prototype.getTerms = function (doc, typeTerms) {
        var regexp = typeTerms ? typeTerms : TF.typeTerms.text;
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
        });
        /*
              .reduce<string[]>((acc, it) => {
                const last = acc[acc.length-1]
                const ngramm = last.length < 3
                  ? last + it
                  : it
                acc.push(ngramm)
                return acc
              }, [''])
        */
    };
    TF.prototype.decode = function (modelData) {
        this.docs = modelData.docs.map(function (d) { return new data_lib_1.Counter(d); });
        this.corpus = new data_lib_1.Counter(modelData.corpus);
        // return new TF(docs, corpus)
    };
    TF.prototype.encode = function () {
        return {
            docs: this.docs.map(function (v) { return v.toObject(); }),
            corpus: this.corpus.toObject(),
        };
    };
    TF.prototype.addCorpus = function (corpus) {
        var _this = this;
        corpus.forEach(function (doc) { return _this.addDoc(doc); });
    };
    TF.prototype.addDoc = function (doc) {
        var terms = this.getTerms(doc);
        var tfDoc = data_lib_1.Counter.fromArray(terms);
        this.docs.push(tfDoc);
        this.corpus.extend(tfDoc);
    };
    TF.prototype.learn = function (handleCalcDoc, handleCalcCorpus, isImmutable) {
        var _this = this;
        var calcWeigthDoc = handleCalcDoc || this.handleCalcDoc;
        var calcWeigthCorpus = handleCalcCorpus || this.handleCalcCorpus;
        var newTfDocs = this.docs.map(function (doc) { return doc.map(function (key, count, len) { return calcWeigthDoc(count, len); }); });
        var rawTfCorpus = newTfDocs.reduce(function (corpus, doc) { return corpus.extend(doc); }, new data_lib_1.Counter());
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
    TF.prototype.predict = function (doc) {
        console.error('еще нету этой фичи');
    };
    // чтоб можжно было переопределить метод getTerms, взять отсюда регулярку
    TF.typeTerms = {
        code: /(\w+|&|!|=|<|>|{|}|\[|\]|\(|\)|\+|-|@|\$|\*|\/|\?|"|'|,|;)/,
        text: /(\w+|[а-я]+)/
    };
    return TF;
}(model_1.Model));
exports.TF = TF;
