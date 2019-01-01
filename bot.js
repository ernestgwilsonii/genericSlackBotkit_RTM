const Botkit = require('botkit');

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
    console.log('~~~~~~~~~~');
    console.log('Execute your bot application like this:');
    console.log('npm install');
    console.log('token=<MY SLACK TOKEN> node bot.js');
    console.log('Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots')
    console.log('~~~~~~~~~~');
}