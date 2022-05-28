import ModuleCondensedDocs from '../data/module-condensed'
import Method from './Method'

const ModuleCondensed: Partial<Record<string, any>> = {}

Object.keys(ModuleCondensedDocs).forEach((key) => {
  ModuleCondensed[key] = () => <Method {...ModuleCondensedDocs[key]} />
})

export { ModuleCondensed }
