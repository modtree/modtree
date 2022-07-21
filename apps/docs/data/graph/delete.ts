export const deleteMethod: MethodProps = {
  method: 'Deletes a graph',
  description: 'Deletes a graph',
  endpoint: '/graph/{graphId}',
  requestType: 'DELETE',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the graph',
        required: true,
      },
    ],
  },
}
