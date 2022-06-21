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
  savedGraphs: ['4dcf096d-fc1a-4b01-99df-17cc01cba16c'],
}

export const deleteMethod: MethodProps = {
  method: 'Delete a user',
  description: 'Deletes a user. Also deletes associated graphs.',
  endpoint: '/users/{userId}',
  requestType: 'DELETE',
  parameters: {
    pathParams: [
      {
        name: 'userId',
        dataType: 'string',
        description: 'The id of the user',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
