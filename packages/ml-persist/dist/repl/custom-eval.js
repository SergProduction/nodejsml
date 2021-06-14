"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customEval = void 0;
var transform = function (code) {
    var tokens = code.split(/\s+/).slice(1, -1);
    return tokens.reduceRight(function (acc, t) {
        if (acc === '') {
            return t;
        }
        return t + ("(" + acc + ")");
    }, '');
};
var isCustomEval = function (cmd) { return cmd[0] === '/'; };
function customEval(cmd, context, filename, callback) {
    if (isCustomEval(cmd)) {
        callback(null, eval(transform(cmd)));
    }
    else {
        callback(null, eval(cmd));
    }
}
exports.customEval = customEval;
