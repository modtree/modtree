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
  method: 'List all modules condensed',
  description: 'Retrieve basic information about all modules',
  endpoint: '/modulesCondensed/',
  requestType: 'GET',
  parameters: {},
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
