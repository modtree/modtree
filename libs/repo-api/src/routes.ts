type RouteInfo = {
  url: string
  params?: Record<string, any>
}

type JestEach = ['post' | 'get' | 'patch' | 'delete', string, RouteInfo]

// TODO consider referring to references/routes.json to
// make sure this is updated
//
// however filling in the route properties will probably be manual
export const routes: JestEach[] = [
  [
    'get',
    '/module-condensed/:moduleCode',
    {
      url: '/module-condensed/CS1010S',
    },
  ],
  [
    'get',
    '/modules-condensed',
    {
      url: '/modules-condensed',
      params: {
        moduleCodes: ['CS1010S', 'MA2001'],
      },
    },
  ],
  [
    'get',
    '/search/modules-condensed/:searchQuery',
    {
      url: '/search/modules-condensed/CS1010',
    },
  ],
]
