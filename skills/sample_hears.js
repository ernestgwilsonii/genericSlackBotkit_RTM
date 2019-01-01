// This module demonstrates simple uses of Botkit's "hears" handler functions

const wordfilter = require('wordfilter'); // https://github.com/dariusk/wordfilter/blob/master/lib/badwords.json

module.exports = function (controller) {
    controller.hears(['version'], 'direct_message,direct_mention', (bot, message) => {
        bot.reply(message, 'beep 1.0.0 beep beep beep');
    });

    controller.hears(['uptime'], 'direct_message,direct_mention', (bot, message) => {
        bot.reply(message, 'I have been up for ' + formatUptime(process.uptime()));
    });

    controller.hears(['hello'], 'ambient,mention,direct_message,direct_mention', (bot, message) => {
        bot.reply(message, 'Hello!');
    });

    controller.hears(['say (.*)', 'say'], 'direct_message,direct_mention', (bot, message) => {
        if (message.match[1]) {
            if (!wordfilter.blacklisted(message.match[1])) {
                bot.reply(message, message.match[1]);
            } else {
                bot.reply(message, '_hmm... sigh_');
            }
        } else {
            bot.reply(message, 'I will repeat whatever you say.')
        }
    });

    // Utility function to format uptime
    function formatUptime(uptime) {
        let unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }
        uptime = uptime + ' ' + unit;
        return uptime;
    }

};
