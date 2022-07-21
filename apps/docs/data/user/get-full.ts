export const getFull: MethodProps = {
  method: 'Get a full user',
  description: 'Retrieve information about one user, including relations',
  endpoint: '/user/{userId}/get-full',
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
