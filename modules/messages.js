const initiate = {
  attachments: [
    {
      color: '#5A352D',
      title: 'Do you want to report an incident?',
      callback_id: 'log',
      actions: [
        {
          name: 'yes',
          text: 'Yes',
          type: 'button',
          value: 'report',
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


module.exports = {
  initiate
};

