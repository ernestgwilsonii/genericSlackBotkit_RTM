////////////////////////////////////////////////////////////////////////////////
const Botkit = require('botkit');
const { getAwsSecrets } = require('./lib/getAwsSecrets');
const { slackGetUsersInfo } = require('./lib/slackGetUsersInfo');
const { chatOpsLogger } = require('./lib/chatOpsLogger');
////////////////////////////////////////////////////////////////////////////////
(async function () {
    try {
        // Try to get a Slack token via environment variable (dev)
        if (process.env.slackToken) {
            console.log("INFORMATIONAL: Slack environment variable slackToken found");
        } else {
            // Try to get Slack token via AWS Secrets Manager (prod)
            console.log("NOTICE: Attempting to get Slack token via AWS Secrets Manager");
            let secrets = await getAwsSecrets();
            let keys = Object.keys(secrets);

            keys.forEach(key => {
                process.env[key] = secrets[key]
            });

            if (!process.env.slackToken) {
                // Failed to get a Slack token via environment variable and AWS Secrets Manager
                console.error("ERROR: Specify a Slack bot token!");
                devUsageTip();
                process.exit(1);
            }
        }

        // Create the Botkit controller
        let controller = Botkit.slackbot({
            debug: false,
            retry: 10,
            studio_token: process.env.studio_token
        });

        // Spawn a single instance of the bot and connect Slack
        let bot = controller.spawn({
            token: process.env.slackToken,
        }).startRTM();

        // Load the skills
        let normalizedPath = require("path").join(__dirname, "skills");
        require("fs").readdirSync(normalizedPath).forEach(function (file) {
            require("./skills/" + file)(controller);
        });

        // Display CLI help
        function devUsageTip() {
            console.log("Launch your bot like this:");
            console.log("npm install");
            console.log("slackToken=YourSlackToken node bot.js");
            console.log("Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots");
        }

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

        ///////////////////////////////////////////////////
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

    } catch (err) {
        console.error(err);
    }
})();
////////////////////////////////////////////////////////////////////////////////
