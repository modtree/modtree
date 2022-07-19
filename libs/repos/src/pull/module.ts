import axios from 'axios'
import { DataSource, Repository } from 'typeorm'
import { NUSMods, Module } from '@modtree/types'
import { nusmodsApi, flatten, client, log } from '@modtree/utils'
import { ModuleCondensedRepository } from '../module-condensed'

export class ModuleRepository extends Repository<Module> {
  private moduleCondensedRepo: ModuleCondensedRepository

  constructor(db: DataSource) {
    super(Module, db.manager)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
  }
  deleteAll = () => this.createQueryBuilder().delete().execute()

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
   * @returns {Promise<Module>}
   */
  async fetchOne(moduleCode: string): Promise<Module> {
    return axios.get(nusmodsApi(`modules/${moduleCode}`)).then((res) => {
      const n: NUSMods.Module = res.data
      const m = this.create(n)
      return m
    })
  }

  /**
   * Fetches modules with full details. These modules are found in
   * ModuleCondensed, but not yet in Module.
   *
   * If limit is specified, only fetches exactly that number of modules.
   *
   * @param {number} limit
   * @returns {Promise<Module[]>}
   */
  async pull(limit?: number): Promise<Module[]> {
    let buffer = 0
    const moduleCodes = new Set(await this.getCodes())
    const moduleCondensedCodes = await this.moduleCondensedRepo.getCodes()
    const diff = moduleCondensedCodes.filter((x) => !moduleCodes.has(x))
    log.yellow(`fetching ${diff.length} modules from NUSMods...`)
    const result: Module[] = []
    const writeQueue: Promise<Module>[] = []
    const fetchQueue: Promise<void>[] = []

    const config = {
      freq: 0.1,
      buffer: 100,
      limit: limit || diff.length,
    }

    for (let i = 0; i < diff.length && i < config.limit; i++) {
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
}
