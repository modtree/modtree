import ModuleCondensed from '@/data/module-condensed'
import Module from '@/data/module'
import Degree from '@/data/degree'
import DAG from '@/data/dag'
import User from '@/data/user'
import Method from './Method'

type EntityName = 'Module' | 'ModuleCondensed' | 'Degree' | 'DAG' | 'User'

type EntityMethodDocs = Record<string, () => JSX.Element>

const data: Record<EntityName, Record<string, MethodProps>> = {
  Module,
  ModuleCondensed,
  Degree,
  DAG,
  User,
}

const API: Record<EntityName, EntityMethodDocs> = {
  Module: {},
  ModuleCondensed: {},
  Degree: {},
  DAG: {},
  User: {},
}

Object.keys(data).forEach((entity: EntityName) => {
  Object.keys(data[entity]).forEach((method) => {
    API[entity][method] = () => <Method {...data[entity][method]} />
  })
})

export default API
