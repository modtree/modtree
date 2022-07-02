import { JestEach } from './index'

export const ModuleCondensedRoutes: JestEach[] = [
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

export const ModuleRoutes: JestEach[] = [
  [
    'get',
    '/module/:moduleCode',
    {
      url: '/module/CS1010S',
    },
  ],
  [
    'get',
    '/modules',
    {
      url: '/modules',
    },
  ],
  [
    'get',
    '/search/modules/:searchQuery',
    {
      url: '/search/modules/CS1010',
    },
  ],
]

export const ModuleFullRoutes: JestEach[] = [
  [
    'get',
    '/module-full/:moduleCode',
    {
      url: '/module-full/EL3201',
    },
  ],
]
