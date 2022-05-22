import axios from 'axios'
import { Agent } from 'https'
import { log } from '../cli'
import { container } from '../data-source'
import { nusmodsApi } from '../utils/string'
import { Module as NM } from '../../types/nusmods'
import { Module } from '../entity/Module'
import { ModuleCondensedRepository } from './ModuleCondensed'
import { DataSource, Repository } from 'typeorm'
import {
  getDataSource,
  LoadRelations,
  useLoadRelations,
  useBuild,
} from './base'

interface ModuleRepository extends Repository<Module> {
  build(props: NM): Module
  get(): Promise<Module[]>
  fetchOne(moduleCode: string): Promise<Module>
  getCodes(): Promise<string[]>
  pull(): Promise<Module[]>
  findByFaculty(faculty: string): Promise<Module[]>
  loadRelations: LoadRelations<Module>
  findByCodes(moduleCodes: string[]): Promise<Module[]>
}

/**
 * @param {DataSource} database
 * @return {ModuleRepository}
 */
export function ModuleRepository(database?: DataSource): ModuleRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Module)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * a drop-in replacement of a constructor
   * @param {NM} props
   * @return {Module}
   */
  function build(props: NM): Module {
    return useBuild(db, Module, props)
  }

  /**
   * get all modules in the database
   * @return {Promise<Module[]>}
   */
  async function get(): Promise<Module[]> {
    const modules = await container(db, async () => {
      const modules = await BaseRepo.find().catch((err) => {
        log.warn('Warning: failed to get Modules from database.')
        console.log(err)
        return []
      })
      return modules
    })
    if (!modules) return []
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
    const moduleCondesedCodes = await ModuleCondensedRepository(db).getCodes()
    const diff = moduleCondesedCodes.filter((x) => !moduleCodes.has(x))
    let buffer = 0
    const result: Module[] = []
    await container(db, async () => {
      const fetchQueue = []
      const writeQueue = []
      const test = async (moduleCode: string) => {
        const res = await client.get(`${moduleCode}.json`)
        const n: NM = res.data
        const m = build(n)
        result.push(m)
        writeQueue.push(BaseRepo.save(m))
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
    if (!result) return []
    return result
  }

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
   * @param {string[]} moduleCodes
   * @return {Promise<Module[]>}
   */
  async function findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return BaseRepo.createQueryBuilder('module')
      .where('module.moduleCode IN (:...moduleCodes)', { moduleCodes })
      .getMany()
  }

  return BaseRepo.extend({
    build,
    get,
    getCodes,
    fetchOne,
    pull,
    findByFaculty,
    loadRelations,
    findByCodes,
  })
}
