import axios from 'axios'
import { Agent } from 'https'
import { log } from '../cli'
import { AppDataSource, container } from '../data-source'
import { nusmodsApi } from '../utils/string'
import { Module as NM } from '../../types/nusmods'
import { Module } from '../entity/Module'
import { ModuleCondensedRepository } from './ModuleCondensed'

/**
 * @param {string} faculty
 * @return {Promise<Module[]>}
 */
async function findByFaculty(faculty: string): Promise<Module[]> {
  return BaseRepo.createQueryBuilder('module')
    .where('module.faculty = :faculty', { faculty })
    .getMany()
}

/**
 * a drop-in replacement of a constructor
 * @param {NM} props
 * @return {Module}
 */
function build(props: NM): Module {
  const m = new Module()
  m.acadYear = props.acadYear || ''
  m.moduleCode = props.moduleCode || ''
  m.title = props.title || ''
  m.description = props.description || ''
  m.moduleCredit = props.moduleCredit || ''
  m.department = props.department || ''
  m.faculty = props.faculty || ''
  m.workload = props.workload || ''
  m.aliases = props.aliases || []
  m.attributes = props.attributes || {}
  m.prerequisite = props.prerequisite || ''
  m.corequisite = props.corequisite || ''
  m.preclusion = props.preclusion || ''
  m.prereqTree = props.prereqTree || ''
  m.semesterData = props.semesterData || []
  m.fulfillRequirements = props.fulfillRequirements || []
  return m
}

/**
 * get all modules in the database
 * @return {Promise<Module[]>}
 */
async function get(): Promise<Module[]> {
  const modules = await container(async () => {
    const modules = await BaseRepo.find().catch((err) => {
      log.warn('Warning: failed to get Modules from database.')
      console.log(err)
    })
    return modules
  })
  if (!modules) {
    return []
  }
  return modules
}

/**
 * get all module codes from the module table
 * @return {Promise<string[]>}
 */
async function getCodes(): Promise<string[]> {
  const modules = await get()
  const codes = modules.map((m) => m.moduleCode)
  return codes
}

/**
 * fetches exactly one module with full details
 * @param {string} moduleCode
 */
async function fetchOne(moduleCode: string): Promise<Module> {
  const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
  const n: NM = res.data
  const m = build(n)
  return m
}

/**
 * fetches exactly one module with full details
 */
async function pull(): Promise<Module[]> {
  const client = axios.create({
    baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
    timeout: 60000,
    maxRedirects: 10,
    httpsAgent: new Agent({ keepAlive: true }),
  })
  const moduleCodes = new Set(await getCodes())
  const moduleCondesedCodes = await ModuleCondensedRepository.getCodes()
  const diff = moduleCondesedCodes.filter((x) => !moduleCodes.has(x))
  let buffer = 0
  const result: Module[] = []
  await container(async () => {
    const fetchQueue = []
    const writeQueue = []
    const test = async (moduleCode: string) => {
      const res = await client.get(`${moduleCode}.json`)
      const n: NM = res.data
      const m = build(n)
      result.push(m)
      writeQueue.push(AppDataSource.manager.save(m))
      return 'ok'
    }
    for (let i = 0; i < diff.length; i++) {
      const moduleCode = diff[i]
      while (buffer > 100) {
        await new Promise((resolve) => setTimeout(resolve, 0.1))
      }
      buffer += 1
      fetchQueue.push(
        test(moduleCode)
          .then(() => {
            buffer -= 1
          })
          .catch(() => {
            buffer -= 1
            log.red(moduleCode)
            throw new Error(`failed loading ${moduleCode}`)
          })
      )
    }
    await Promise.all(fetchQueue)
    await Promise.all(writeQueue)
    return result
  })
  if (!result) {
    return []
  }
  return result
}

const BaseRepo = AppDataSource.getRepository(Module)
export const ModuleRepository = BaseRepo.extend({
  findByFaculty,
  build,
  getCodes,
  fetchOne,
  pull,
})
