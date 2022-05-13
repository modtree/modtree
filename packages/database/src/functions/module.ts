import axios from 'axios'
import { Agent } from 'https'
import { log } from '../cli'
import { AppDataSource, container } from '../data-source'
import { Module } from '../entity'
import { moduleCondensed } from './moduleCondensed'
import { Module as NM } from '../../types/nusmods'
import { nusmodsApi } from '../utils/string'

export namespace module {
  /**
   * get all modules in the database
   * @return {Promise<Module[]>}
   */
  export async function get(): Promise<Module[]> {
    const modules = await container(async () => {
      const repo = AppDataSource.getRepository(Module)
      const modules = await repo.find().catch((err) => {
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
   * get module codes from the module table
   * @return {Promise<Set<string>>}
   */
  export async function getCodes(): Promise<Set<string>> {
    const modules = await get()
    const codes = modules.map((m) => m.moduleCode)
    return new Set(codes)
  }

  /**
   * fetches exactly one module with full details
   * @param {string} moduleCode
   */
  export async function fetchOne(moduleCode: string): Promise<Module> {
    const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
    const n: NM = res.data
    const m = Module.new(n)
    return m
  }

  /**
   * fetches exactly one module with full details
   */
  export async function pull(): Promise<Module[]> {
    const client = axios.create({
      baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
      timeout: 60000,
      maxRedirects: 10,
      httpsAgent: new Agent({ keepAlive: true }),
    })
    const moduleCodes = await getCodes()
    const moduleCondesedCodes = await moduleCondensed.getCodes()
    const diff = Array.from(moduleCondesedCodes).filter(
      (x) => !moduleCodes.has(x)
    )
    let buffer = 0
    const result: Module[] = []
    await container(async () => {
      const fetchQueue = []
      const writeQueue = []
      const test = async (moduleCode: string) => {
        const res = await client.get(`${moduleCode}.json`)
        const n: NM = res.data
        const m = Module.new(n)
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
}
