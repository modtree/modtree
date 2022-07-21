export const search: MethodProps = {
  method: 'Search all modules condensed',
  description:
    'Returns modules condensed, whose module code is a prefix match with the search query',
  endpoint: '/search/modules-condensed/{searchQuery}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'searchQuery',
        dataType: 'string',
        description: 'The search query',
        required: true,
      },
    ],
  },
}
