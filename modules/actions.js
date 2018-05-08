const { logError } = require('./error_logger');

const tempIncidents = {};

const start = (payload, respond) => {
  const selected = payload.actions[0].value;
  const userId =  payload.user.id;
  if(selected === 'no') {
    return respond({'text': 'Ok, let me know if you change your mind :smiley:'});
  } else if(tempIncidents[userId]) {
    return respond({'text': 'we already started your case'});
  } else {
    tempIncidents[userId] = {
      step: 0
    };
    return respond({'text': 'What is the subject of the incident?'});
  }
  
};

const saveSubject = (event) => {
  const userId = event.user;
  const message = event.text;
  tempIncidents[userId].step += 1;
  //TODO: add subject validation 
  tempIncidents[userId].subject = message;

};

const saveDate = (event) => {
  const userId = event.user;
  const message = event.text;
  tempIncidents[userId].step += 1;
  //TODO: add message validation
  tempIncidents[userId].date = message;

};

const saveTime = (payload, respond) => {
  const userId = payload.user.id;

  switch(payload.actions[0].name) {
  case 'select_hour':
    if (!tempIncidents[userId].time) {
      tempIncidents[userId].time = {
        hour: parseInt(payload.actions[0].selected_options[0].value)
      };

      break;
    } else {
      tempIncidents[userId].time.hour = parseInt(payload.actions[0].selected_options[0].value);
      break;
    }
  case 'select_minute':
    if (!tempIncidents[userId].time) {
      tempIncidents[userId].time = {
        minute: parseInt(payload.actions[0].selected_options[0].value)
      };

      break;
    } else {
      tempIncidents[userId].time.minute = parseInt(payload.actions[0].selected_options[0].value);
      break;
    }
  case 'select_ampm':
    if (!tempIncidents[userId].time) {
      tempIncidents[userId].time = {
        ampm: payload.actions[0].selected_options[0].value
      };

      break;
    } else {
      tempIncidents[userId].time.ampm = payload.actions[0].selected_options[0].value;
      break;
    }
  case 'submit':
    if (!tempIncidents[userId].time || !tempIncidents[userId].time.hour || !tempIncidents[userId].time.minute || !tempIncidents[userId].time.ampm) {
      break;
    } else {
      tempIncidents[userId].step += 1;

      respond({
        'text': 'Where did this happen? (place, city, country)'
      }).catch(error => {
        logError(error);
      });
      break;
    }
  }
};

const saveLocation = (event) => {
  const userId = event.user;
  const message = event.text;
  tempIncidents[userId].step += 1;
  //TODO:location validation
  tempIncidents[userId].location = message;

};

const saveCategory = (payload, respond) => {
  const userId = payload.user.id;
  tempIncidents[userId].category = payload.actions[0].value;
  tempIncidents[userId].step += 1;
  return respond({'text': 'Okay, What happened?'});
};

const saveDescription = (event) => {
  const userId = event.user;
  const message = event.text;
  if (!tempIncidents[userId].description) {
    tempIncidents[userId].description = message;
  } else {
    tempIncidents[userId].description += ' ' + message;
  }
  
  tempIncidents[userId].step += 1;
};

const saveIncident = (payload, respond) => {
  //TODO: hit api
  const userId = payload.user.id;
  delete tempIncidents[userId];
  return respond({text: `Incident reported successfully. Your incident number is \`${payload.incidentId}\``});
};

const saveWitnesses = (event) => {
  const userId = event.user;
  const message = event.text;
  tempIncidents[userId].witnesses = message;
  tempIncidents[userId].step += 1;
};

module.exports = {
  start,
  tempIncidents,
  saveSubject,
  saveDate,
  saveTime,
  saveLocation,
  saveCategory,
  saveDescription,
  saveIncident,
  saveWitnesses
};
