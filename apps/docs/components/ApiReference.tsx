import * as ModuleCondensed from '@/data/module-condensed'
import * as Module from '@/data/module'
import * as Degree from '@/data/degree'
import * as Graph from '@/data/dag'
import * as User from '@/data/user'
import Method from './Method'

type EntityName = 'Module' | 'ModuleCondensed' | 'Degree' | 'Graph' | 'User'

type EntityMethodDocs = Record<string, () => JSX.Element>

/**
 * by the power of JavaScript colon omission,
 * this contains all the imported docs
 */
const data: Record<EntityName, Record<string, MethodProps>> = {
  Module,
  ModuleCondensed,
  Degree,
  Graph,
  User,
}

/**
 * This will be the exported variable.
 * Documentation components will be accessible, for instance, via
 * <API.ModuleCondensed.get />
 * in the mdx files that import this variable.
 */
const API: Record<EntityName, EntityMethodDocs> = {
  Module: {},
  ModuleCondensed: {},
  Degree: {},
  Graph: {},
  User: {},
}

/** The raw-data to React Component mapper */
Object.keys(data).forEach((entity: EntityName) => {
  Object.keys(data[entity]).forEach((method) => {
    API[entity][method] = () => <Method {...data[entity][method]} />
  })
})

export default API
