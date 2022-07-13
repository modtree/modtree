import { DataSource, In } from 'typeorm'
import { Module, InitModuleProps, IModuleRepository } from '@modtree/types'
import { flatten, unique, hasTakenModule, checkTree } from '@modtree/utils'
import { BaseRepo } from '../base'

type Data = {
  moduleCode: string
  inDegree: boolean
  numUnlockedModules: number
  origIdx: number
}

export class ModuleRepository implements IModuleRepository {
  private repo: BaseRepo<Module>
  constructor(db: DataSource) {
    this.repo = new BaseRepo(Module, db)
  }

  deleteAll = () => this.repo.createQueryBuilder().delete().execute()
  findOneById = async (id: string) => this.repo.findOneByOrFail({ id })

  /**
   * initialize a Module
   *
   * @param {InitModuleProps} props
   * @returns {Promise<Module>}
   */
  async initialize(props: InitModuleProps): Promise<Module> {
    return this.repo.save(this.repo.create(props))
  }

  /**
   * @param {string[]} moduleCode
   * @returns {Promise<T>}
   */
  findByCode(moduleCode: string): Promise<Module> {
    return this.repo.findOneByOrFail({ moduleCode })
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<T[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return this.repo.findBy({ moduleCode: In(moduleCodes) })
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async getCodes(): Promise<string[]> {
    return this.repo.find().then((res) => res.map(flatten.module))
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
    // 1. filter modulesDone and modulesDoing
    if (hasTakenModule(modulesDone, modulesDoing, moduleCode)) {
      return false
    }
    // 2. find module
    return this.findByCode(moduleCode)
      .then((module) =>
        // 3. check if PrereqTree is fulfilled
        checkTree(module.prereqTree, modulesDone)
      )
      .catch(() => false)
  }

  /**
   * Returns union of all moduleCodes' post-reqs.
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<string[]>}
   */
  async getPostReqs(moduleCodes: string[]): Promise<string[]> {
    return this.findByCodes(moduleCodes).then((modules) =>
      unique(
        modules.reduce(
          (result, curr) => [...result, ...curr.fulfillRequirements],
          [] as string[]
        )
      )
    )
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
    const postReqsPromise = this.getPostReqs(modules)
    const canTakePromise = postReqsPromise.then((postReqs) =>
      Promise.all(
        postReqs.map((p) => this.canTakeModule(modules, modulesDoing, p))
      )
    )
    return Promise.all([postReqsPromise, canTakePromise]).then(
      ([postReqs, canTake]) =>
        /**
         * return all the post requisites
         */
        postReqs
          /**
           * that can be taken
           */
          .filter((_, index) => canTake[index])
          /**
           * and that has not been taken before
           */
          .filter(
            (module) => !hasTakenModule(modulesDone, modulesDoing, module)
          )
    )
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
    // 1. Return empty array if module in modulesDone or modulesDoing
    if (hasTakenModule(modulesDone, modulesDoing, moduleCode)) return []
    return Promise.all([
      // 2. Get current eligible modules
      this.getEligibleModules(modulesDone, modulesDoing, []),
      // 3. Get unlocked eligible modules
      this.getEligibleModules(modulesDone, modulesDoing, [moduleCode]),
    ]).then(([eligible, unlocked]) =>
      // 4. Compare unlockedModules to eligibleModules
      unlocked.filter((code) => !eligible.includes(code))
    )
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
    /**
     * get module codes of modules that are eligible for,
     * that are also within the post-requisites
     */
    const filtered = Promise.all([
      this.getPostReqs(modules),
      this.getEligibleModules(modulesDone, modulesDoing, modulesSelected),
    ]).then(([postReqs, eligible]) =>
      eligible.filter((code) => postReqs.includes(code))
    )

    /**
     * get a count of how many modules a doing a particular module unlocks
     */
    const unlockedModuleCounts = filtered
      .then((filtered) =>
        Promise.all(
          filtered.map((code) =>
            this.getUnlockedModules(modulesDone, modulesDoing, code)
          )
        )
      )
      .then((unlocked) =>
        unlocked.map((codes) => (Array.isArray(codes) ? codes.length : 0))
      )

    /**
     * consolidate data used for ranking later
     */
    const data = Promise.all([filtered, unlockedModuleCounts]).then(
      ([filtered, unlockedModuleCounts]) =>
        filtered.map(
          (moduleCode, origIdx): Data => ({
            moduleCode,
            inDegree: requiredModules.includes(moduleCode),
            numUnlockedModules: unlockedModuleCounts[origIdx],
            origIdx,
          })
        )
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

    const sorted = Promise.all([data, filtered]).then(([data, filtered]) => {
      data.sort(cmp)
      return data.map((module) => filtered[module.origIdx])
    })

    return sorted
  }
}
