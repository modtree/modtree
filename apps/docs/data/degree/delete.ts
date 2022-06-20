import { generateSchema } from 'utils'

const fulfilled = {
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

export const deleteMethod: MethodProps = {
  method: 'Deletes a degree',
  description: 'Deletes a degree. Also deletes associated graphs.',
  endpoint: '/degrees/{degreeId}',
  requestType: 'DELETE',
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
