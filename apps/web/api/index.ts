import { DegreeApi } from './degree'
import { GraphApi } from './graph'
import { ModuleCondensedApi } from './module-condensed'
import { UserApi } from './user'

export const api = {
  degree: new DegreeApi(),
  moduleCondensed: new ModuleCondensedApi(),
  graph: new GraphApi(),
  user: new UserApi(),
}
