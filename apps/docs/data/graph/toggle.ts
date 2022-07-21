export const toggle: MethodProps = {
  method: 'Toggle a module',
  description: 'Toggle the visibility of a module in a graph',
  endpoint: '/graph/{graphId}/toggle/{moduleCode}',
  requestType: 'PATCH',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the graph',
        required: true,
      },
      {
        name: 'moduleCode',
        dataType: 'string',
        description: 'The module code of the module to be toggled',
        required: true,
      },
    ],
  },
}
