import axios from 'axios'
import { DataSource, In, Repository } from 'typeorm'
import { Module } from '@modtree/entity'
import {
  IModule,
  IModuleCondensedRepository,
  IModuleRepository,
  FindOneById,
  InitProps,
  NUSMods,
} from '@modtree/types'
import { nusmodsApi, flatten, unique, client, log } from '@modtree/utils'
import { hasTakenModule, checkTree } from './utils'
import { useDeleteAll, useFindOneByKey } from '@modtree/repo-base'
import { ModuleCondensedRepository } from './ModuleCondensed'

type Data = {
  moduleCode: string
  inDegree: boolean
  numUnlockedModules: number
  origIdx: number
}

export class ModuleRepository
  extends Repository<Module>
  implements IModuleRepository
{
  private moduleCondensedRepo: IModuleCondensedRepository

  constructor(db: DataSource) {
    super(Module, db.manager)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
  }

  deleteAll = useDeleteAll(this)
  findOneById: FindOneById<IModule> = useFindOneByKey(this, 'id')

  /**
   * initialize a Module
   *
   * @param {InitProps['Module']} props
   * @returns {Promise<Module>}
   */
  async initialize(props: InitProps['Module']): Promise<Module> {
    return this.create(props)
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async getCodes(): Promise<string[]> {
    return this.find().then((res) => res.map(flatten.module))
  }

  /**
   * fetches exactly one module with full details
   *
   * @param {string} moduleCode
   */
  async fetchOne(moduleCode: string): Promise<Module> {
    return axios.get(nusmodsApi(`modules/${moduleCode}`)).then((res) => {
      const n: NUSMods.Module = res.data
      const m = this.create(n)
      return m
    })
  }

  /**
   * fetches exactly one module with full details
   */
  async pull(): Promise<Module[]> {
    const config = {
      freq: 0.1,
      buffer: 100,
    }
    let buffer = 0
    const moduleCodes = new Set(await this.getCodes())
    const moduleCondesedCodes = await this.moduleCondensedRepo.getCodes()
    const diff = moduleCondesedCodes.filter((x) => !moduleCodes.has(x))
    log.yellow(`fetching ${diff.length} modules from NUSMods...`)
    const result: Module[] = []
    const writeQueue: Promise<Module>[] = []
    const fetchQueue: Promise<void>[] = []

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
            const n: NUSMods.Module = res.data
            const m = this.create(n)
            result.push(m)
            writeQueue.push(this.save(m))
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
  findByFaculty(faculty: string): Promise<Module[]> {
    return this.findBy({ faculty })
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return this.find({ where: { moduleCode: In(moduleCodes) } })
  }

  /**
   * Given modulesDone, determines if a module (moduleCode) can be taken.
   * Returns false if moduleCode is in modulesDone or modulesDoing.
   *
   * @param {string[]} modulesDone
   * @param {string[]} modulesDoing
   * @param {string} moduleCode
   */
  async canTakeModule(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<boolean> {
    // 1. find module
    const module = await this.findOneBy({ moduleCode })
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
  async getPostReqs(moduleCodes: string[]): Promise<string[]> {
    const modules = await this.findByCodes(moduleCodes)
    // get array of module codes of post-reqs (fulfillRequirements)
    const postReqCodes: string[] = []
    modules.forEach((module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array) {
        postReqCodes.push(...module.fulfillRequirements)
      }
    })
    const uniqueCodes = unique(postReqCodes)
    return uniqueCodes
  }

  /**
   * Returns all mods a user can take, based on what the user has completed.
   *
   * modulesSelected helps to temporarily 'add' modules as done.
   *
   * @param {string[]} modulesDone
   * @param {string[]} modulesDoing
   * @param {string[]} modulesSelected
   * @returns {Promise<Module[]>}
   */
  async getEligibleModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[]
  ): Promise<string[]> {
    const modules = unique(modulesDone.concat(modulesSelected))
    // 1. get post-reqs
    const postReqs = await this.getPostReqs(modules)
    if (!postReqs) return []
    // 2. filter post-reqs
    const results = await Promise.all(
      postReqs.map((one) => this.canTakeModule(modules, modulesDoing, one))
    )
    const filtered = postReqs.filter((_, idx) => results[idx])
    // 3. remove modulesDone and modulesDoing
    const final = filtered.filter(
      (one) => !hasTakenModule(modulesDone, modulesDoing, one)
    )
    return final
  }

  /**
   * List mods that will be unlocked by completing a mod.
   *
   * @param {string[]} modulesDone
   * @param {string[]} modulesDoing
   * @param {string} moduleCode
   */
  async getUnlockedModules(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<string[]> {
    // future support for multiple mods
    const addedModuleCodes = [moduleCode]
    // 1. Return empty array if module in modulesDone or modulesDoing
    if (hasTakenModule(modulesDone, modulesDoing, moduleCode)) return []
    // 2. Get current eligible modules
    const eligibleModules = await this.getEligibleModules(
      modulesDone,
      modulesDoing,
      []
    )
    // 3. Get unlocked eligible modules
    const unlockedModules = await this.getEligibleModules(
      modulesDone,
      modulesDoing,
      addedModuleCodes
    )
    // 4. Compare unlockedModules to eligibleModules
    const filtered = unlockedModules.filter(
      (moduleCode) => !eligibleModules.includes(moduleCode)
    )
    return filtered
  }

  /**
   * Suggest modules from one/many.
   * Returns a subset of post-reqs of these modules.
   *
   * modulesDone and modulesDoing are purely for checking pre-reqs/taken before
   * modulesSelected are the mods that the suggestions should stem from.
   * requiredModules are the degree mods.
   *
   * @param {string[]} modulesDone
   * @param {string[]} modulesDoing
   * @param {string[]} modulesSelected
   * @param {string[]} requiredModules
   */
  async getSuggestedModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[],
    requiredModules: string[]
  ): Promise<string[]> {
    const modules = unique(modulesDone.concat(modulesSelected))
    // get relevant modules
    const postReqs = await this.getPostReqs(modules)
    const eligibleModules = await this.getEligibleModules(
      modulesDone,
      modulesDoing,
      modulesSelected
    )
    const filtered = eligibleModules.filter((one) => postReqs.includes(one))
    // obtain data for sorting criteria
    const resolvedPromises = await Promise.all(
      filtered.map((moduleCode) =>
        this.getUnlockedModules(modulesDone, modulesDoing, moduleCode)
      )
    )
    const unlockedModuleCounts = resolvedPromises.map((one) =>
      one instanceof Array ? one.length : 0
    )
    // -- data processing
    const data = filtered.map(
      (moduleCode, origIdx): Data => ({
        moduleCode,
        inDegree: requiredModules.includes(moduleCode),
        numUnlockedModules: unlockedModuleCounts[origIdx],
        origIdx,
      })
    )

    /**
     * Sorting comparator
     * higher priority => want smaller final index in the array
     * - if a higher priority, return -1
     * - elif a lower priority, return 1
     * - else return 0
     *
     * @param {Data} a
     * @param {Data} b
     * @returns {number}
     */
    function cmp(a: Data, b: Data): number {
      if (a.inDegree !== b.inDegree) return a.inDegree ? -1 : 1
      if (a.numUnlockedModules !== b.numUnlockedModules)
        return a.numUnlockedModules > b.numUnlockedModules ? -1 : 1
      return a.moduleCode < b.moduleCode ? -1 : 1
    }

    // Sort and rebuild original array
    data.sort(cmp)
    const final = data.map((one) => filtered[one.origIdx])
    return final
  }
}
