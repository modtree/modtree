export const deleteMethod: MethodProps = {
  method: 'Delete a user',
  description: 'Deletes a user. Also deletes associated graphs.',
  endpoint: '/user/{userId}',
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
}
