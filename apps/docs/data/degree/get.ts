import { generateSchema } from 'utils'

const fulfilled = {
  id: 'ea65f888-cde5-424e-9fa4-552ecc9ad275',
  title: 'Computer Science',
  modules: [
    'CS1101S',
    'CS1231S',
    'CS2030S',
    'CS2040S',
    'CS2100',
    'CS2103T',
    'CS2106',
    'CS2109S',
    'CS3230',
    'CP3106',
    'CP3209',
    'CP4101',
    'CP4106',
    'CP3200',
    'CP3202',
    'CP3107',
    'CP3110',
    'IS4010',
    'TR3202',
  ],
}

export const get: MethodProps = {
  method: 'Get a degree',
  description: 'Retrieve information about one degree',
  endpoint: '/degree/{degreeId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'degreeId',
        dataType: 'string',
        description: 'The id of the degree.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
