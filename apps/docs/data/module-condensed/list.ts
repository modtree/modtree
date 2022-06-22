import { generateSchema } from 'utils'

const fulfilled = [
  {
    id: 'fff52647-b948-43c3-a796-a81495d7a715',
    moduleCode: 'CS1010S',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
]

export const list: MethodProps = {
  method: 'List some modules condensed',
  description: 'Retrieve basic information about some modules',
  endpoint: '/modules-condensed/',
  requestType: 'GET',
  parameters: {
    queryParams: [
      {
        name: 'moduleCodes',
        dataType: 'string[]',
        description:
          'An array of module codes. Leave empty to retrieve all modules condensed.',
        required: false,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
