export const flow: MethodProps = {
  method: 'Update flow props',
  description:
    'This endpoint updates React Flow props. This includes moving a node.',
  endpoint: '/graph/{graphId}/flow',
  requestType: 'PATCH',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the graph',
        required: true,
      },
    ],
    bodyParams: [
      {
        name: 'flowNodes',
        dataType: 'Node[]',
        description: 'Information required to display React Flow nodes.',
        required: true,
      },
      {
        name: 'flowEdges',
        dataType: 'Edge[]',
        description: 'Information required to display React Flow edges.',
        required: true,
      },
    ],
  },
}
