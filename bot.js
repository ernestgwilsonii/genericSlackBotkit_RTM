////////////////////////////////////////////////////////////////////////////////
const Botkit = require('botkit');
const { slackGetUsersInfo } = require('./lib/slackGetUsersInfo');
const { chatOpsLogger } = require('./lib/chatOpsLogger');
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Make sure we have a Slack token
if (!process.env.token) {
    console.log("ERROR: Specify a Slack bot token in the environment!");
    usage_tip();
    process.exit(1);
}

// Create the Botkit controller
let controller = Botkit.slackbot({
    debug: false,
    retry: 10,
    studio_token: process.env.studio_token
});

// Spawn a single instance of the bot and connect Slack
let bot = controller.spawn({
    token: process.env.token,
}).startRTM();

// Load the skills
let normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller);
});

// Display CLI help
function usage_tip() {
    console.log("Execute your bot application like this:");
    console.log("npm install");
    console.log("token=YourSlackToken node bot.js");
    console.log("Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots");
}
////////////////////////////////////////////////////////////////////////////////



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
