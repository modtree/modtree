export const create: MethodProps = {
  method: 'Create a graph',
  description: 'Create a graph',
  endpoint: '/graph/',
  requestType: 'POST',
  parameters: {
    bodyParams: [
      {
        name: 'userId',
        dataType: 'string',
        description: 'The id of the user creating the graph',
        required: true,
      },
      {
        name: 'degreeId',
        dataType: 'string',
        description: 'The id of the degree associated the graph',
        required: true,
      },
      {
        name: 'modulesPlacedCodes',
        dataType: 'string[]',
        description: 'Module codes of modules to insert into the graph',
        required: true,
      },
      {
        name: 'modulesHiddenCodes',
        dataType: 'string[]',
        description:
          'Module codes of modules to include in the graph, but are visually hidden',
        required: true,
      },
      {
        name: 'pullAll',
        dataType: 'boolean',
        description:
          'Setting this to true will populate modulesHiddenCodes with user.modulesDone, user.modulesDoing, degree.modules',
        required: true,
      },
    ],
  },
}
