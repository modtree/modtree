export const login: MethodProps = {
  method: 'Login',
  description: 'Login into modtree',
  endpoint: '/user/{authZeroId}/login',
  requestType: 'POST',
  parameters: {
    pathParams: [
      {
        name: 'authZeroId',
        dataType: 'string',
        description: 'The id of the user registered in Auth0',
        required: true,
      },
    ],
    bodyParams: [
      {
        name: 'email',
        dataType: 'string',
        description: 'The email address of the user',
        required: false,
      },
    ],
  },
}
