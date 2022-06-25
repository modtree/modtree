import { generateSchema } from 'utils'

const fulfilled = {
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
  savedDegrees: ['cb70ebf4-6733-4bcf-b605-a98170f6f0e2'],
  savedGraphs: [],
}

export const insertDegrees: MethodProps = {
  method: 'Insert degrees',
  description: 'Adds degrees to a user',
  endpoint: '/users/{userId}/degrees',
  requestType: 'PATCH',
  parameters: {
    pathParams: [
      {
        name: 'userId',
        dataType: 'string',
        description: 'The id of the user',
        required: true,
      },
    ],
    bodyParams: [
      {
        name: 'degreeIds',
        dataType: 'string[]',
        description: 'An array of degree ids to add to the user',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
