import axios from 'axios'
import { DataSource } from 'typeorm'
import { log } from '../cli'
import { nusmodsApi, Flatten } from '../utils'
import { Module as NM } from '../../types/nusmods'
import { Module } from '../entity/Module'
import { ModuleCondensedRepository } from './ModuleCondensed'
import { getDataSource, useLoadRelations, useDeleteAll } from './base'
import type { ModuleRepository as Repository } from '../../types/repository'
import { client } from '../utils/pull'

/**
 * @param {DataSource} database
 * @returns {ModuleRepository}
 */
export function ModuleRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Module)
  const loadRelations = useLoadRelations(BaseRepo)
  const deleteAll = useDeleteAll<Module>(BaseRepo)

  /**
   * get all modules in the database
   *
   * @returns {Promise<Module[]>}
   */
  async function get(): Promise<Module[]> {
    return BaseRepo.find()
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async function getCodes(): Promise<string[]> {
    const modules = await get()
    const codes = modules.map(Flatten.module)
    return codes
  }

  /**
   * fetches exactly one module with full details
   *
   * @param {string} moduleCode
   */
  async function fetchOne(moduleCode: string): Promise<Module> {
    const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
    const n: NM = res.data
    const m = BaseRepo.create(n)
    return m
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
    const moduleCondesedCodes = await ModuleCondensedRepository(db).getCodes()
    const diff = moduleCondesedCodes.filter((x) => !moduleCodes.has(x))
    console.log(`fetching ${diff.length} modules from NUSMods...`)
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
  async function findByFaculty(faculty: string): Promise<Module[]> {
    return BaseRepo.createQueryBuilder('module')
      .where('module.faculty = :faculty', { faculty })
      .getMany()
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  async function findByCodes(moduleCodes: string[]): Promise<Module[]> {
    if (moduleCodes.length === 0) {
      return []
    }
    return BaseRepo.createQueryBuilder('module')
      .where('module.moduleCode IN (:...moduleCodes)', { moduleCodes })
      .getMany()
  }

  return BaseRepo.extend({
    get,
    getCodes,
    fetchOne,
    pull,
    findByFaculty,
    loadRelations,
    findByCodes,
    deleteAll,
  })
}
