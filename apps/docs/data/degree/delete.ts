export const deleteMethod: MethodProps = {
  method: 'Deletes a degree',
  description: 'Deletes a degree. Also deletes associated graphs.',
  endpoint: '/degree/{degreeId}',
  requestType: 'DELETE',
  parameters: {
    pathParams: [
      {
        name: 'degreeId',
        dataType: 'string',
        description: 'The id of the degree',
        required: true,
      },
    ],
  },
}
