const { populateHours, populateMinutes } = require('../modules/time_populator');

const initiate = {
  attachments: [
    {
      color: '#5A352D',
      title: 'Do you want to report an incident?',
      callback_id: 'report',
      actions: [
        {
          name: 'yes',
          text: 'Yes',
          type: 'button',
          value: 'yes',
        },
        {
          name: 'no',
          text: 'No',
          type: 'button',
          value: 'no',
        },
      ],
    },
  ],
};

const categoryMessage = {
  attachments: [
    {
      'color': '#5A352D',
      'title': 'What category does the incident belong to?',
      'callback_id': 'category',
      'actions' : [
        {
          'name': 'red',
          'text': 'Red',
          'type': 'button',
          'value': 'red',
          'style': 'danger'
        },
        {
          'name': 'yellow',
          'text': 'Yellow',
          'type': 'button',
          'value': 'yellow'
        },
        {
          'name': 'green',
          'text': 'Green',
          'type': 'button',
          'value': 'green'
        },
        {
          'name': 'other',
          'text': 'I don\'t know',
          'type': 'button',
          'value': 'other'
        }
      ]
    }
  ]
};

const getDateMessage = {
  text: 'When did the incident occur? (dd-mm-yy)'
};

const getConfirmationMessage = (data) =>
{
  return {
    'attachments': [
      {
        'color': '#36a64f',
        'pretext': 'Please confirm the incident',
        'callback_id': 'confirm',
        'fields': [
          {
            'title': 'Subject',
            'value': data.subject,
            'short': false
          },
          {
            'title': 'Category',
            'value': data.category,
            'short': false
          },
          {
            'title': 'Date',
            'value': data.date,
            'short': false
          },
          {
            'title': 'Time',
            'value': `${data.time.hour}:${data.time.minute} ${data.time.ampm}`
          },
          {
            'title': 'Location',
            'value': data.location,
            'short': false
          },
          {
            'title': 'Description',
            'value': data.description,
            'short': false
          },
          {
            'title': 'Witnesses',
            'value': data.witnesses,
            'short': false
          }
        ],
        'actions' : [
          {
            'name': 'confirm',
            'text': 'Confirm',
            'type': 'button',
            'value': 'confirm',
            'style': 'primary'
          },
          {
            'name': 'cancel',
            'text': 'Cancel',
            'type': 'button',
            'value': 'cancel'
          }
        ]
      }
    ]
  };
};

const witnessesMessage = {
  attachments: [
    {
      color: '#5A352D',
      title: 'Do you have any witnesses?',
      callback_id: 'witnesses',
      actions: [
        {
          name: 'yes',
          text: 'Yes',
          type: 'button',
          value: 'yes',
        },
        {
          name: 'no',
          text: 'No',
          type: 'button',
          value: 'no',
        },
      ],
    },
  ],
};

const getTimeMessage = {
  // Include timezone option?
  // Format in which to send the time to the backend?
  // How backend will handle the different timezones?
  // Time to be in 12 or 24 hr format?
  attachments: [
    {
      color: '#5A352D',
      title: 'What time did this take place?',
      callback_id: 'time_selection',
      actions: [
        {
          name: 'select_hour',
          text: 'Select Hour...',
          value: 'hour',
          type: 'select',
          options: populateHours()
        },
        {
          name: 'select_minute',
          text: 'Select Minute...',
          value: 'minute',
          type: 'select',
          options: populateMinutes()
        },
        {
          name: 'select_ampm',
          text: 'Select AM/PM...',
          value: 'ampm',
          type: 'select',
          options: [
            {
              text: 'AM',
              value: 'AM'
            },
            {
              text: 'PM',
              value: 'PM'
            }
          ]
        },
        {
          name: 'submit',
          text: 'Next',
          type: 'button',
          value: 'submit'
        }
      ]
  
    }
  ]
};


module.exports = {
  initiationMessage: initiate,
  getDateMessage,
  getConfirmationMessage,
  categoryMessage,
  witnessesMessage,
  getTimeMessage
};
