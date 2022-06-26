import { generateSchema } from 'utils'

const fulfilled = [
  {
    id: 'a760b1fe-0503-46b9-8ff6-ef619bbe6bf4',
    moduleCode: 'CS1010',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: '71b963fa-6b8d-4889-9823-48d2f19c8b79',
    moduleCode: 'CS1010E',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: 'e0fb37f9-387d-47cf-8ae1-5a24a5516503',
    moduleCode: 'CS1010J',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: '34e0fddb-6258-45b2-af8b-389ca5664cd2',
    moduleCode: 'CS1010R',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: 'afde7812-8f03-497e-8e23-15302d35df54',
    moduleCode: 'CS1010S',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
  {
    id: '4fe12b91-71da-4174-8ff8-3a6f23f62bc4',
    moduleCode: 'CS1010X',
    moduleLevel: 1010,
    title: 'Programming Methodology',
  },
]

export const search: MethodProps = {
  method: 'Search all modules condensed',
  description:
    'Returns modules condensed, whose module code is a prefix match with the search query',
  endpoint: '/search/modules-condensed/{searchQuery}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'searchQuery',
        dataType: 'string',
        description: 'The search query',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
