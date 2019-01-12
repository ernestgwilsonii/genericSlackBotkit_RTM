const Botkit = require('botkit');
const { slackGetUsersInfo } = require('./lib/slackGetUsersInfo');
const { chatOpsLogger } = require('./lib/chatOpsLogger');

if (!process.env.token) {
    console.log('Error: Specify a Slack bot token in environment.');
    usage_tip();
    process.exit(1);
}

// Create the Botkit controller, which controls all instances of the bot
let controller = Botkit.slackbot({
    debug: false,
    retry: 10,
    studio_token: process.env.studio_token
});

// Spawn a single instance of the bot to connect to your Slack team
let bot = controller.spawn({
    token: process.env.token,
}).startRTM();


let normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller);
});


function usage_tip() {
    console.log('Execute your bot application like this:');
    console.log('npm install');
    console.log('token=<MY SLACK TOKEN> node bot.js');
    console.log('Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots');
}



////////////////////////////////////////////////////////////////////////////////
// HELP AREA(S) //
//////////////////

////////////////////
// help internet //
///////////////////
controller.hears(['help internet'], 'direct_message,direct_mention', (bot, message) => {
    const { botHelp_internet } = require('./help/botHelp_internet');
    (async function () {
        try {
            let personDetails = await slackGetUsersInfo(message);
            //console.log("personDetails: " + JSON.stringify(personDetails, null, 2));
            //let slackUsername = personDetails.user.name;
            let firstName = personDetails.user.profile.first_name;
            let reply = `Hello ${firstName} ${botHelp_internet}`;
            bot.reply(message, reply);
            chatOpsLogger(message);
        } catch (err) {
            console.error(err);
            let errMsg = ":disappointed: Bummer... " + err;
            bot.reply(message, errMsg);
        }
    })();
});


////////////////////////////////////////////////////////////////////////////////
// BOT HELP GLOBAL CATCH ALL AND UNKNOWN SECTION //
///////////////////////////////////////////////////
// Catch "all" HELP function  - For "help" or anything unknown sent to the bot!
controller.on('direct_message,direct_mention', (bot, message) => {
    const { botHelp } = require('./help/botHelp');
    (async function () {
        try {
            let personDetails = await slackGetUsersInfo(message);
            //console.log("personDetails: " + JSON.stringify(personDetails, null, 2));
            //let slackUsername = personDetails.user.name;
            let firstName = personDetails.user.profile.first_name;
            let reply = `Hello ${firstName} ${botHelp}`;
            bot.reply(message, reply);
            chatOpsLogger(message);
        } catch (err) {
            console.error(err);
            let errMsg = ":disappointed: Bummer... " + err;
            bot.reply(message, errMsg);
        }
    })();
});
////////////////////////////////////////////////////////////////////////////////
