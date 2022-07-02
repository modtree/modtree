import { Route } from './index'

export const ModuleCondensedRoutes: Route[] = [
  {
    route: '/module-condensed/:moduleCode',
    method: 'get',
    url: '/module-condensed/CS1010S',
  },
  {
    route: '/modules-condensed',
    method: 'get',
    url: '/modules-condensed',
    params: {
      moduleCodes: ['CS1010S', 'MA2001'],
    },
  },
  {
    route: '/search/modules-condensed/:searchQuery',
    method: 'get',
    url: '/search/modules-condensed/CS1010',
  },
]

export const ModuleRoutes: Route[] = [
  {
    route: '/module/:moduleCode',
    method: 'get',
    url: '/module/CS1010S',
  },
  {
    route: '/modules',
    method: 'get',
    url: '/modules',
  },
  {
    route: '/search/modules/:searchQuery',
    method: 'get',
    url: '/search/modules/CS1010',
  },
]

export const ModuleFullRoutes: Route[] = [
  {
    route: '/module-full/:moduleCode',
    method: 'get',
    url: '/module-full/EL3201',
  },
]
