import { generateSchema } from 'utils'

const fulfilled = {
  title: 'Computer Science',
  modules: ['CS1101S', 'CS1231S', 'CS2030S', 'CS2040S'],
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
