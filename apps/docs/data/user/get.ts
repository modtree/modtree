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
    fulfilled: {
      displayName: 'Nguyen Vu Khang',
      username: 'nguyenvukhang',
      modulesDone: ['MA1100', 'CS1010S'],
      modulesDoing: ['MA2219'],
      matriculationYear: 2021,
      graduationYear: 2024,
      graduationSemester: 2,
      savedDegrees: [
        'cb70ebf4-6733-4bcf-b605-a98170f6f0e2',
        'ab4eceaf-ee9c-4032-88dd-687b38322249',
      ],
    },
    schema: {
      displayName: 'string',
      username: 'string',
      modulesDone: 'string[]',
      modulesDoing: 'string[]',
      matriculationYear: 'number',
      graduationYear: 'number',
      graduationSemester: 'number',
      savedDegrees: 'string[]',
    },
  },
}
