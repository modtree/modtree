export const create: MethodProps = {
  method: 'Create a user',
  description: 'Create a user',
  endpoint: '/user/{userId}',
  requestType: 'POST',
  parameters: {
    bodyParams: [
      {
        name: 'authZeroId',
        dataType: 'string',
        description: 'The id of the user registered in Auth0',
        required: true,
      },
    ],
  },
}
