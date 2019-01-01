module.exports = function (controller) {

    controller.on('bot_channel_join,bot_group_join', (bot, message) => {
        bot.reply(message, 'Hello! I am a bot and am here to help.');
    });

    controller.on('user_channel_join,user_group_join', (bot, message) => {
        bot.reply(message, 'Welcome, <@' + message.user + '>');
    });
}