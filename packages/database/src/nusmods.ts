import { ModuleCondensed, Module } from './entity'
import { ModuleCondensed as NMC, Module as NM } from '../types/nusmods'
import axios from 'axios'
import { AppDataSource, container } from './data-source'
import { listModuleCondensed } from './modules'
import { log } from './cli'
import { Agent } from 'https'
import { listModules } from './modules'
import { sanitizeJSON } from './string'

export const nusmodsApi = (req: string) =>
  `https://api.nusmods.com/v2/2021-2022/${req}.json`

function getNumbersBetweenLetters(s: string): string {
  return s.replace(/\D*([0-9]*)\D*.*$/, '$1')
}

export const fetchAllModuleCondensed = async (): Promise<ModuleCondensed[]> => {
  const res = await axios.get(nusmodsApi('moduleList'))
  const data: NMC[] = res.data
  const lengths = new Set()
  const outliers: string[] = []
  const modules: ModuleCondensed[] = []
  data.forEach((n) => {
    const m = new ModuleCondensed()
    const btw = getNumbersBetweenLetters(n.moduleCode)
    const l = btw.length
    lengths.add(l)
    if (l !== 4) {
      outliers.push(n.moduleCode)
      return
    }
    m.title = n.title
    m.moduleCode = n.moduleCode
    m.moduleLevel = parseInt(btw) || 0
    modules.push(m)
  })
  console.debug('unique lengths:', Array.from(lengths))
  console.debug('non-4 lengths', outliers)
  console.debug('total response', data.length)
  console.debug('total indexed', modules.length)
  return modules
}

export const fetchNewModuleCondensed = async (): Promise<ModuleCondensed[]> => {
  log.fname('fetchNewModuleCondensed')
  const existing = await listModuleCondensed()
  const freshPull = await fetchAllModuleCondensed()
  const toAdd = freshPull.filter((x) => !existing.has(x.moduleCode))
  console.log(toAdd)
  console.log('total:', toAdd.length)
  return toAdd
}

export const writeModuleCondensed = async (moduleList: ModuleCondensed[]) =>
  container(async () => {
    console.debug('Importing a list of condensed modules...')
    await AppDataSource.manager.save(moduleList)
    console.log('Done saving.')
  })

export const writeModule = async (moduleList: Module[]) =>
  container(async () => {
    console.debug('Importing a list of condensed modules...')
    await AppDataSource.manager.save(moduleList)
    console.log('Done saving.')
  })

export const fetchModule = async (moduleCode: string): Promise<Module> => {
  const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
  const n: NM = res.data
  const m = new Module()
  constructModule(n, m)
  return m
}

export const fetchSomeModule = async (n: number): Promise<Module[]> => {
  const client = axios.create({
    baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
    timeout: 60000,
    maxRedirects: 10,
    httpsAgent: new Agent({ keepAlive: true }),
  })
  const toPull = await listModuleCondensed()
  const already = await listModules()
  const _arr = Array.from(toPull).filter((x) => !already.has(x))
  const arr = _arr.slice(0, n)
  const q = []
  const w = []
  let buffer = 0
  console.log('-----------------------')
  for (let i = 0; i < arr.length; i++) {
    while (buffer > 100) {
      await new Promise((resolve) => setTimeout(resolve, 0.1))
    }
    buffer += 1
    q.push(
      client
        .get(`${arr[i]}.json`)
        .then((res) => {
          const n: NM = res.data
          const m = new Module()
          constructModule(n, m)
          w.push(m)
          log.green(m.moduleCode)
          buffer -= 1
        })
        .catch(() => {
          log.red('dropped')
          buffer -= 1
        })
    )
    log.yellow(i.toString())
  }
  await Promise.allSettled(q)
  return w
}

export const constructModule = (n: NM, m: Module) => {
  m.acadYear = n.acadYear
  m.moduleCode = n.moduleCode
  m.title = n.title
  // m.description = n.description
  m.moduleCredit = n.moduleCredit
  m.department = n.department
  m.faculty = n.faculty
  // m.workload = n.workload
  m.aliases = n.aliases
  m.attributes = n.attributes
  m.prerequisite = n.prerequisite
  m.corequisite = n.corequisite
  m.preclusion = n.preclusion
  // m.prereqTree = n.prereqTree
  m.fulfillRequirements = n.fulfillRequirements
}
