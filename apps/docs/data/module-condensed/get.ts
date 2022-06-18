import { generateSchema } from 'utils'

const fulfilled = {
  id: 'fff52647-b948-43c3-a796-a81495d7a715',
  moduleCode: 'CS1010S',
  moduleLevel: 1010,
  title: 'Programming Methodology',
}

export const get: MethodProps = {
  method: 'Get a module condensed',
  description: 'Retrieve basic information about one module',
  endpoint: '/modulesCondensed/{moduleCode}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'moduleCode',
        dataType: 'string',
        description: 'The code of the module.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
