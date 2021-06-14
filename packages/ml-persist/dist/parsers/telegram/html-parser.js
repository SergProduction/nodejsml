"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlParse = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var log = function () {
    var p = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        p[_i] = arguments[_i];
    }
}; // console.log
var htmlParse = function (html) {
    var $ = cheerio_1.default.load(html);
    var day = null;
    var name = null;
    var messages = [];
    var domMessages = Array.from($('.history').children());
    var domIterMessages = Array.from(domMessages);
    for (var i = 0; i < domIterMessages.length; i++) {
        var el = domIterMessages[i];
        var message = {};
        var id = $(el).attr('id');
        if (id === undefined)
            continue;
        message.id = parseInt(id.replace('message', ''), 10);
        var body = $(el).children('.body');
        message.name = $(body).find('.from_name').text().trim() || undefined;
        message.text = $(body).find('.text').text().trim() || undefined;
        message.time = $(body).find('.date').text().trim() || undefined;
        var reply = $(body).find('.reply_to').find('a').attr('href') || null;
        if (reply !== null) {
            var replyIdStr = reply.replace(/.*go_to_message(\d+)/, function (match, replyId) {
                return replyId;
            });
            if (replyIdStr !== '') {
                message.reply = parseInt(replyIdStr, 10);
            }
        }
        var isDay = id.indexOf('-');
        if (isDay !== -1) {
            message.day = $(el).text().trim() || undefined;
        }
        else {
            message.day = null;
        }
        if (message.day !== null && message.day !== undefined) {
            day = message.day;
        }
        else {
            message.day = day;
        }
        if (message.name !== null && message.name !== undefined) {
            name = message.name;
        }
        else {
            message.name = name;
        }
        message.date = new Date(message.day + " " + message.time);
        delete message.day;
        delete message.time;
        messages.push(message);
    }
    var messagesFullInfo = messages.filter(function (m) {
        if (!m.id) {
            log('empty id ' + m.id + ' in', m);
            return false;
        }
        if (!m.name) {
            log('empty name ' + m.name + ' in', m);
            return false;
        }
        if (!m.text) {
            log('empty text ' + m.text + ' in', m);
            return false;
        }
        if (!m.date) {
            log('empty date ' + m.date + ' in', m);
            return false;
        }
        return true;
    });
    return messagesFullInfo;
};
exports.htmlParse = htmlParse;
