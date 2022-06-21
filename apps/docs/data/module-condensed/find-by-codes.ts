import { generateSchema } from 'utils'

const fulfilled = [
  {
    id: 'fff52647-b948-43c3-a796-a81495d7a715',
    moduleCode: 'CS1010S',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: 'dc3ea168-8322-4a86-b740-51672fbe4752',
    moduleCode: 'MA2001',
    moduleLevel: 2001,
    title: 'Linear Algebra I',
  },
]

export const findByCodes: MethodProps = {
  method: 'Find some modules condensed',
  description: 'Retrieve basic information about some modules',
  endpoint: '/modulesCondensed/find-by-codes',
  requestType: 'GET',
  parameters: {
    queryParams: [
      {
        name: 'moduleCodes',
        dataType: 'array',
        description: 'An array of module codes',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
