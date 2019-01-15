# genericSlackBotkit_RTM
Slack Botkit using Real Time Messaging (RTM via outbound WebSocket, not inbound HTTP ports as with events API)

### Based on [Botkit](https://botkit.ai) for [Slack](https://slack.com)

### Get Started

Clone this repository:

```
git clone https://github.com/ernestgwilsonii/genericSlackBotkit_RTM.git
```

Install:

```
cd genericSlackBotkit_RTM
npm install
```

Get a [Slack Bot API Token](https://my.slack.com/apps/new/A0F7YS25R-bots)

Launch the bot:

```
slackToken=YourSlackTokenGoesHere node bot.js
```

Docker:
```
./docker_buil.sh
docker run -it --rm --name perceptron -e slackToken=xoxb-NNNNNNNNNNN-NNNNNNNNNNNN-XXXXXXXXXXXXXXXXXXXXXXXX ernestgwilsonii/perceptron:v1.0.0
```

AWS Secrets Manager (optional):
```
aws secretsmanager --region us-east-1 create-secret --name botkit --description "Botkit Secrets" --secret-string file://secrets.json
aws secretsmanager --region us-east-1 get-secret-value --secret-id botkit
```

### Future: https://github.com/sohlex/botkit-rasa
