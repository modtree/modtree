import { DegreeApi } from './degree'
import { ModuleCondensedApi } from './module-condensed'

export const api = {
  degree: new DegreeApi(),
  moduleCondensed: new ModuleCondensedApi(),
}
