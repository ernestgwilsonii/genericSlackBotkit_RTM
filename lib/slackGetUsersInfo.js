////////////////////////////////////////////////////////////////////////////////
const Slack = require('slack'); // https://www.npmjs.com/package/slack
let token = process.env.token;
let debug = false;
////////////////////////////////////////////////////////////////////////////////

async function slackGetUsersInfo(message) {
    if (debug) { console.log("slackGetUsersInfo message: " + JSON.stringify(message, null, 2)); };
    let slack = new Slack({ token });
    let user = message.user;
    let res = await slack.users.info({ token, user }); // https://api.slack.com/methods/users.info
    if (debug) { console.log("slackGetUsersInfo res: " + JSON.stringify(res, null, 2)); };
    return (res);
}
module.exports.slackGetUsersInfo = slackGetUsersInfo;
////////////////////////////////////////////////////////////////////////////////