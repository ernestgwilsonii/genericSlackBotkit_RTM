const AWS = require('aws-sdk'); // https://aws.amazon.com/sdk-for-node-js/

// https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html
let secretsManager = new AWS.SecretsManager({ region: 'us-east-1' || process.env.AWS_REGION });

async function getAwsSecrets() {
    try {
        let results = await secretsManager.getSecretValue({ SecretId: "botkit" }).promise();
        return JSON.parse(results.SecretString);
    }
    catch (err) {
        throw new Error(err);
    }
}
module.exports.getAwsSecrets = getAwsSecrets;