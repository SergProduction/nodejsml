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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf_1 = require("./tf");
// import sampleJson from '../sample/prog-langs.json'
var check_sample_1 = __importDefault(require("./check-sample"));
var persist_1 = require("./persist");
var lib_1 = require("./lib");
/* to-do
2:30 start
3:15 save to bd and load from bd - 1h
4 add repl
---
30m add effectors files from olimp and marked
30m added one cluster method
1h playnig with weigths. some example math.log10(x*x)
*/
var loadManyTF = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var maybeTf, fullSample, sample, tf;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, persist_1.persist.load(key)];
            case 1:
                maybeTf = _a.sent();
                if (maybeTf !== null) {
                    return [2 /*return*/, tf_1.ManyTF.fromObject(maybeTf)];
                }
                return [4 /*yield*/, lib_1.loadSample('prog-langs')];
            case 2:
                fullSample = _a.sent();
                sample = lib_1.objMap(fullSample, function (label, docs) { return docs.slice(0, 50); });
                tf = new tf_1.ManyTF();
                lib_1.objForEach(sample, function (label, docs) {
                    tf.addCorpus(label, docs);
                });
                return [4 /*yield*/, persist_1.persist.save(key, tf.toObject())];
            case 3:
                _a.sent();
                return [2 /*return*/, tf];
        }
    });
}); };
var predictManyTF = function (sampleName, checkSamples) { return __awaiter(void 0, void 0, void 0, function () {
    var tf;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadManyTF(sampleName)];
            case 1:
                tf = _a.sent();
                tf.calcWeigths();
                checkSamples.forEach(function (doc) {
                    var result = tf.predictLabel(doc);
                    console.log(result);
                });
                return [2 /*return*/];
        }
    });
}); };
predictManyTF('langs-raw', check_sample_1.default);
// printLabel('Shell')
// exp1: classic obj
// calculate: 40769.242ms
// predict: 2.789ms
// calculate: 26574.327ms
