import { generateSchema } from 'utils'

const fulfilled = {
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
  savedGraphs: [],
}

export const get: MethodProps = {
  method: 'Get a user',
  description: 'Retrieve information about one user',
  endpoint: '/user/{userId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'userId',
        dataType: 'string',
        description: 'The id of the user.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
