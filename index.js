const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const slackInteractiveMessages = require('@slack/interactive-messages');
const { createSlackEventAdapter } = require('@slack/events-api');
const SlackClient = require('@slack/client').WebClient;
const initiationMessage = require('./modules/messages').initiate; 

const dotenv = require('dotenv');

dotenv.load();

const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const sc = new SlackClient(process.env.SLACK_BOT_TOKEN);
const slackMessages = slackInteractiveMessages
  .createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const port = process.env.PORT || 3000;

slackEvents.on('message', (event) => {
  // do not respond to edited messages or messages from me
  if (event.subtype === 'bot_message' || event.subtype === 'message_changed') {
    return;
  };
  console.log(event);
  sc.chat.postMessage(
    event.channel,
    '',
    initiationMessage,
  (err, res) => {
    console.log(res);
  });
});


// Start a basic HTTP server
const app = express();
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slack/actions', slackMessages.expressMiddleware());
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});