export const list: MethodProps = {
  method: 'List many users',
  description:
    'Retrieve information about all users that match the search query. At least one of the keys must be specified.',
  endpoint: '/users/',
  requestType: 'GET',
  parameters: {
    queryParams: [
      {
        name: 'id',
        dataType: 'string',
        description: 'The id of the user',
        required: false,
      },
      {
        name: 'authZeroId',
        dataType: 'string',
        description: 'The id of the user registered in Auth0',
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
}
