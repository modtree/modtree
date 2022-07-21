export const insertDegrees: MethodProps = {
  method: 'Insert degrees',
  description: 'Adds degrees to a user',
  endpoint: '/user/{userId}/degree',
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
}
