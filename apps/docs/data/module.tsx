const module: any[] = [
  {
    title: 'Get a module',
    description: 'Retrieve detailed information about one module',
    endpoint: '/repos/{owner}/{repo}',
    parameters: {
      headers: [
        {
          name: 'accept',
          type: 'string',
          description:
            'Setting to `application/vnd.github.v3+json` is recommended.',
        },
      ],
      pathParameters: [
        {
          name: 'owner',
          type: 'string',
          description:
            'The account owner of the repository. The name is not case sensitive.',
          required: true,
        },
        {
          name: 'repo',
          type: 'string',
          description:
            'The name of the repository. The name is not case sensitive.',
          required: true,
        },
      ],
    },
  },
]

export const getModule = {
  title: 'Get a module',
  description: 'Retrieve detailed information about one module',
  endpoint: '/repos/{owner}/{repo}',
  parameters: {
    headers: [
      {
        name: 'accept',
        type: 'string',
        description:
          'Setting to `application/vnd.github.v3+json` is recommended.',
      },
    ],
    pathParameters: [
      {
        name: 'owner',
        type: 'string',
        description:
          'The account owner of the repository. The name is not case sensitive.',
        required: true,
      },
      {
        name: 'repo',
        type: 'string',
        description:
          'The name of the repository. The name is not case sensitive.',
        required: true,
      },
    ],
  },
}
