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
  savedDegrees: [
    'cb70ebf4-6733-4bcf-b605-a98170f6f0e2',
    'ab4eceaf-ee9c-4032-88dd-687b38322249',
  ],
  savedGraphs: ['4dcf096d-fc1a-4b01-99df-17cc01cba16c'],
}

export const getByPrimaryKeys: MethodProps = {
  method: 'Get a user by primary keys',
  description:
    'Retrieve information about one user. At least one of the following primary keys must be specified.',
  endpoint: '/users/get-by-primary-keys',
  requestType: 'POST',
  parameters: {
    bodyParams: [
      {
        name: 'id',
        dataType: 'string',
        description: 'The id of the user.',
        required: false,
      },
      {
        name: 'authZeroId',
        dataType: 'string',
        description: 'The id of the user registered in Auth0.',
        required: false,
      },
      {
        name: 'email',
        dataType: 'string',
        description: 'The email address of the user',
        required: false,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
