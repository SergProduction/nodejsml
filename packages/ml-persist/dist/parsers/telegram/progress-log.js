"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneLineLog = void 0;
var oneLineLog = function (text) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(text.toString());
};
exports.oneLineLog = oneLineLog;
