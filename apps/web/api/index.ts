import { DegreeApi } from './degree'
import { GraphApi } from './graph'
import { ModuleApi } from './module'
import { ModuleCondensedApi } from './module-condensed'
import { UserApi } from './user'

export const api = {
  degree: new DegreeApi(),
  moduleCondensed: new ModuleCondensedApi(),
  module: new ModuleApi(),
  graph: new GraphApi(),
  user: new UserApi(),
}
