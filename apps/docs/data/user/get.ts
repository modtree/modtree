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
        description: 'The id of the user',
        required: true,
      },
    ],
  },
}
