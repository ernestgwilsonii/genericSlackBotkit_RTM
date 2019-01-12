////////////////////////////////////////////////////////////////////////////////
const moment = require('moment-timezone');
////////////////////////////////////////////////////////////////////////////////

function chatOpsLogger(message) {
    let currentTime = +moment.utc(); // Get current time

    console.log("currentTime: " + currentTime);
    console.log(JSON.stringify(message, null, 2));
}
module.exports.chatOpsLogger = chatOpsLogger;
////////////////////////////////////////////////////////////////////////////////