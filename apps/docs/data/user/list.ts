import { generateSchema } from 'utils'

const fulfilled = [
  {
    id: 'e9f66c30-c96f-4ebd-b771-99ae8646f438',
    authZeroId: 'auth0|6294dbffdc4dea0068d77f61',
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'khang@modtree.com',
    modulesDone: ['MA1100', 'CS1010S'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
    savedDegrees: [
      'cb70ebf4-6733-4bcf-b605-a98170f6f0e2',
      'ab4eceaf-ee9c-4032-88dd-687b38322249',
    ],
    savedGraphs: ['4dcf096d-fc1a-4b01-99df-17cc01cba16c'],
  },
  {
    id: '7aedb747-cd78-4116-ab67-c72fcce198a5',
    authZeroId: 'auth0|2f4dcee5164e459ab8fcd3a2',
    displayName: 'Tan Wei Seng',
    username: 'weiseng',
    email: 'weiseng@modtree.com',
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
    modulesDone: ['CS1101S', 'MA2001'],
    modulesDoing: [],
    savedDegrees: ['d44ff19f-c054-43a2-93bb-ee94e87b68f5'],
    savedGraphs: [],
  },
]

export const list: MethodProps = {
  method: 'List all users',
  description: 'Retrieve information about all users',
  endpoint: '/users/',
  requestType: 'GET',
  parameters: {},
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
