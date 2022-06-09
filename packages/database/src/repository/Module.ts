import axios from 'axios'
import { DataSource, In } from 'typeorm'
import { log } from '../cli'
import { nusmodsApi, flatten } from '../utils'
import { Module as NM } from '../../types/nusmods'
import { InitProps } from '../../types/init-props'
import { Module } from '../entity/Module'
import { getModuleCondensedRepository } from './ModuleCondensed'
import {
  getDataSource,
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from './base'
import { IModuleRepository } from '../../types/repository'
import { client } from '../utils/pull'
import { checkTree, hasTakenModule } from '../utils'

/**
 * @param {DataSource} database
 * @returns {ModuleRepository}
 */
export function getModuleRepository(database?: DataSource): IModuleRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Module)
  const deleteAll = useDeleteAll<Module>(BaseRepo)
  const findOneById = useFindOneByKey(BaseRepo, 'id')
  const allRelations = getRelationNames(BaseRepo)
  const [ModuleCondensedRepository] = [getModuleCondensedRepository(db)]

  /**
   * initialize a Module
   *
   * @param {InitProps['Module']} props
   * @returns {Promise<Module>}
   */
  async function initialize(props: InitProps['Module']): Promise<Module> {
    return BaseRepo.create(props)
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async function getCodes(): Promise<string[]> {
    return BaseRepo.find().then((res) => res.map(flatten.module))
  }

  /**
   * fetches exactly one module with full details
   *
   * @param {string} moduleCode
   */
  async function fetchOne(moduleCode: string): Promise<Module> {
    return axios.get(nusmodsApi(`modules/${moduleCode}`)).then((res) => {
      const n: NM = res.data
      const m = BaseRepo.create(n)
      return m
    })
  }

  /**
   * fetches exactly one module with full details
   */
  async function pull(): Promise<Module[]> {
    const config = {
      freq: 0.1,
      buffer: 100,
    }
    let buffer = 0
    const moduleCodes = new Set(await getCodes())
    const moduleCondesedCodes = await ModuleCondensedRepository.getCodes()
    const diff = moduleCondesedCodes.filter((x) => !moduleCodes.has(x))
    log.yellow(`fetching ${diff.length} modules from NUSMods...`)
    const [result, fetchQueue, writeQueue] = [[], [], []]

    for (let i = 0; i < diff.length; i++) {
      const moduleCode = diff[i]
      while (buffer > config.buffer) {
        await new Promise((resolve) => setTimeout(resolve, config.freq))
      }
      buffer += 1
      fetchQueue.push(
        client
          .get(`${moduleCode}.json`)
          .then((res) => {
            buffer -= 1
            const n: NM = res.data
            const m = BaseRepo.create(n)
            result.push(m)
            writeQueue.push(BaseRepo.save(m))
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
  }

  /**
   * @param {string} faculty
   * @returns {Promise<Module[]>}
   */
  function findByFaculty(faculty: string): Promise<Module[]> {
    return BaseRepo.find({ where: { faculty }, relations: allRelations })
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  function findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return BaseRepo.find({ where: { moduleCode: In(moduleCodes) } })
  }

 /**
  * Given modulesDone, determines if a module (moduleCode) can be taken.
  * Returns false if moduleCode is in modulesDone or modulesDoing.
  *
  * @param {string[]} modulesDone
  * @param {string[]} modulesDoing
  * @param {string} moduleCode
  */
  async function canTakeModule(modulesDone: string[], modulesDoing: string[], moduleCode: string): Promise<boolean> {
    // 1. find module
    const module = await BaseRepo.findOneBy({ moduleCode })
    if (!module) return false
    // 2. filter modulesDone and modulesDoing
    if (hasTakenModule(modulesDone, modulesDoing, moduleCode)) {
      return false
    }
    // 3. check if PrereqTree is fulfilled
    return checkTree(module.prereqTree, modulesDone)
  }

  /**
   * Returns union of all moduleCodes' post-reqs.
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<string[]>}
   */
  async function getPostReqs(
    moduleCodes: string[]
  ): Promise<string[]> {
    const modules = await findByCodes(moduleCodes)
    // get array of module codes of post-reqs (fulfillRequirements)
    const postReqCodesSet = new Set<string>()
    modules.forEach((module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array) {
        module.fulfillRequirements.forEach((moduleCode: string) => {
          postReqCodesSet.add(moduleCode)
        })
      }
    })
    const postReqCodesArr = Array.from(postReqCodesSet)
    return postReqCodesArr
  }

  return BaseRepo.extend({
    initialize,
    getCodes,
    fetchOne,
    pull,
    findByFaculty,
    findByCodes,
    findOneById,
    deleteAll,
    canTakeModule,
    getPostReqs,
  })
}
