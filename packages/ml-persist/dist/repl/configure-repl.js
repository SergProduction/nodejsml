'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCommand = void 0;
var repl_1 = __importDefault(require("repl"));
var path_1 = __importDefault(require("path"));
var historyFile = path_1.default.join(__dirname, '../../repl_history');
var helpText = "\n q                      - \u0432\u044B\u0445\u043E\u0434\n this                   - \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0445 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445\n _                      - \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430\n .editor                - \u043C\u043D\u043E\u0433\u043E\u0441\u0442\u0440\u043E\u0447\u043D\u044B\u0439 \u0432\u0432\u043E\u0434\n .clear                 - \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0433\u043B\u043E\u0431\u0430\u043B \u0441\u043A\u043E\u0443\u043F\n repl                   - \u0438\u043D\u0441\u0442\u0430\u043D\u0441 Repl\n repl.repl._builtinLibs - \u0441\u043F\u0438\u0441\u043E\u043A \u043C\u043E\u0434\u0443\u043B\u0435\u0439\n repl.repl.lines        - \u0441\u043F\u0438\u0441\u043E\u043A \u0432\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u0445 \u043A\u043E\u043C\u0430\u043D\u0434 \u0432 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u0441\u0435\u0441\u0441\u0438\u0438\n repl.repl.history      - \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u0432\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u0445 \u043A\u043E\u043C\u0430\u043D\u0434\n";
console.log(helpText);
var defaultGlobalCommandList = [
    'global',
    'clearInterval',
    'clearTimeout',
    'setInterval',
    'setTimeout',
    'queueMicrotask',
    'clearImmediate',
    'setImmediate',
];
var repl = repl_1.default.start({
    prompt: 'tf> ',
    useColors: true,
    // replMode: Repl.REPL_MODE_STRICT,
    // eval: customEval,
});
repl.setupHistory(historyFile, function (err, repl) {
    if (err)
        throw err;
});
defaultGlobalCommandList.forEach(function (cmd) {
    Object.defineProperty(repl.context, cmd, { enumerable: false });
});
Object.defineProperty(repl.context, 'q', {
    configurable: false,
    enumerable: true,
    get: function () { return repl.close(); },
});
var defineCommand = function (comands) {
    Object.keys(comands).forEach(function (key) {
        Object.defineProperty(repl.context, key, {
            configurable: false,
            enumerable: true,
            value: comands[key]
        });
    });
};
exports.defineCommand = defineCommand;
exports.defineCommand({
    log: console.log,
});
