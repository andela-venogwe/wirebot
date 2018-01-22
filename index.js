const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const slackInteractiveMessages = require("@slack/interactive-messages");
const { createSlackEventAdapter } = require("@slack/events-api");
const SlackClient = require("@slack/client").WebClient;
const { isLocationValid } = require("./modules/validation/location_validation");
const {
  isDescriptionAdequate
} = require("./modules/validation/description_validation");
const { isWitnessValid } = require("./modules/validation/witnesses_validation");
const {
  isDateValid,
  isDateFuture
} = require("./modules/validation/date_validation");

const {
  initiationMessage,
  categoryMessage,
  witnessesMessage,
  getConfirmationMessage
} = require("./modules/messages");
const actions = require("./modules/actions");

const dotenv = require("dotenv");

dotenv.load();

const slackEvents = createSlackEventAdapter(
  process.env.SLACK_VERIFICATION_TOKEN
);
const sc = new SlackClient(process.env.SLACK_BOT_TOKEN);
const slackMessages = slackInteractiveMessages.createMessageAdapter(
  process.env.SLACK_VERIFICATION_TOKEN
);
const port = process.env.PORT || 3000;

const confirmIncident = (user, channel) => {
  const data = actions.tempIncidents[user];
  sc.chat.postMessage(channel, "", getConfirmationMessage(data), (err, res) => {
    // console.log(res);
  });
};

slackEvents.on("message", event => {
  // do not respond to edited messages or messages from me
  if (event.subtype === "bot_message" || event.subtype === "message_changed") {
    return;
  }

  const userId = event.user;
  if (!actions.tempIncidents[userId]) {
    sc.chat.postMessage(event.channel, "", initiationMessage, (err, res) => {
      // console.log(res);
    });
  } else {
    const currentStep = actions.tempIncidents[userId].step;
    switch (currentStep) {
      case 0:
        actions.saveSubject(event);
        sc.chat.postMessage(
          event.channel,
          "When did the incident occur? (dd-mm-yy)",
          (err, res) => {
            // console.log(res);
          }
        );

        break;
      case 1:
        if (isDateValid(event.text) === false) {
          sc.chat.postMessage(
            event.channel,
            "You cannot report a future incident or Invalid date entered (dd-mm-yy)",
            (err, res) => {
              // console.log(res);
            }
          );

          break;
        }

        if (isDateFuture(event.text) === true) {
          sc.chat.postMessage(
            event.channel,
            "You cannot report a future incident or Invalid date entered (dd-mm-yy)",
            (err, res) => {
              // console.log(res);
            }
          );

          break;
        }

        actions.saveDate(event);
        sc.chat.postMessage(
          event.channel,
          "Where did this happen? (place, city, country)",
          (err, res) => {
            // console.log(res);
          }
        );
        break;
      case 2:
        if (isLocationValid(event.text) === false) {
          sc.chat.postMessage(
            event.channel,
            "The location should at minimum be in the format 'place, city, country'",
            (err, res) => {
              // console.log(res);
            }
          );

          break;
        }

        actions.saveLocation(event);
        sc.chat.postMessage(event.channel, "", categoryMessage, (err, res) => {
          // console.log(res);
        });
        break;
      case 3:
        console.log("Logic flaw??");
        break;
      case 4:
        if (isDescriptionAdequate(event.text) === false) {
          sc.chat.postMessage(
            event.channel,
            "Kindly add a bit more description of the incident",
            (err, res) => {
              // console.log(res);
            }
          );

          break;
        }

        actions.saveDescription(event);
        sc.chat.postMessage(event.channel, "", witnessesMessage, (err, res) => {
          // console.log(res);
        });
        break;
      case 5:
        if (isWitnessValid(event.text) === false) {
          sc.chat.postMessage(
            event.channel,
            "Kindly ensure all witnesses' Slack handles are in valid format and correct",
            (err, res) => {
              // console.log(res);
            }
          );

          break;
        }

        actions.saveWitnesses(event);
        confirmIncident(event.user, event.channel);
        break;
      case 6:
        break;
    }
  }
});

slackMessages.action("report", (payload, respond) => {
  actions.start(payload, respond);
  return {
    text: "Just a sec"
  };
});

slackMessages.action("category", (payload, respond) => {
  actions.saveCategory(payload, respond);
  return {
    text: "Just a sec"
  };
});

slackMessages.action("confirm", (payload, respond) => {
  actions.saveIncident(payload, respond);
  return {
    text: "Your incident has been logged"
  };
});

slackMessages.action("witnesses", (payload, respond) => {
  const selected = payload.actions[0].value;
  if (selected === "no") {
    // show confirmation
    const event = {
      user: payload.user.id,
      text: ""
    };
    actions.saveWitnesses(event);
    confirmIncident(payload.user.id, payload.channel.id);
  } else {
    respond({ text: "Who are your witnesses? (@witness1, @witness2)" });
  }
  return {
    text: "Just a sec"
  };
});

// Start a basic HTTP server
const app = express();
app.use(bodyParser.json());
app.use("/slack/events", slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/slack/actions", slackMessages.expressMiddleware());
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});