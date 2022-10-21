export default {
  classifier: {
    processor: 'ClassifierProcessor',
    access: {
      show: '*',
      editable: '*'
    }
  },
  blocks: [ 
    {
      name: 'Создание заявки',
      type: 'offerCreateBlock',
      open: ['CREATION', 'CREATED',  'REJECT', 'CONTINUE_QUESTIONNAIRE', 'CLIENT_VERIFICATION'],
      collapsed: true
    }
  ],
  documents: [      
    { 
      type: 'buyerQuestionnaire',
      block: 'offerCreateBlock',
      name: 'Добавить файлы',
      accept: [
        'image/*',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.text',
        'application/zip',
        'application/x-tika-ooxml',
        'application/x-tika-msoffice',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.spreadsheet'
      ],
      access: {
        show: '*',
        editable: ['CREATION', 'CREATED', 'CONTINUE_QUESTIONNAIRE']
      }
    } 
  ]
};
