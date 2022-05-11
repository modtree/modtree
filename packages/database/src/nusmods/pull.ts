import { Module as NM } from '../../types/nusmods'
import { constructModule } from './utils'
import { log } from '../cli'
import { fetch } from './fetch'
import { listModuleCodes, listModules } from '../modules'
import { ModuleCondensed, Module } from '../entity'
import { AppDataSource, container } from '../data-source'
import axios from 'axios'
import { Agent } from 'https'

export namespace pull {
  export const moduleCondensed = async (): Promise<ModuleCondensed[]> => {
    log.fname('pull-diff moduleCondensed')
    const existing = await listModuleCodes()
    const freshPull = (await fetch.moduleCondensed()).modules
    const toAdd = freshPull.filter((x) => !existing.has(x.moduleCode))
    console.log(toAdd)
    console.log('total:', toAdd.length)
    return toAdd
  }
  /**
   * fetches exactly one module with full details
   */
  export async function modules() {
    const client = axios.create({
      baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
      timeout: 60000,
      maxRedirects: 10,
      httpsAgent: new Agent({ keepAlive: true }),
    })
    const moduleCodes: string[] = Array.from(await listModuleCodes())
    const existing = await listModules()
    const difference = new Set(moduleCodes.filter((x) => !existing.has(x)))
    const diffArr = Array.from(difference)
    let buffer = 0
    container(async () => {
      const fetchQueue = []
      const writeQueue = []
      const test = async (moduleCode: string, index: number) => {
        // const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
        const res = await client.get(`${moduleCode}.json`)
        const n: NM = res.data
        const m = new Module()
        constructModule(n, m)
        console.log(m.moduleCode)
        log.yellow(index.toString())
        writeQueue.push(AppDataSource.manager.save(m))
        return 'ok'
      }
      for (let i = 0; i < diffArr.length; i++) {
        const moduleCode = diffArr[i]
        console.log(moduleCode)
        while (buffer > 100) {
          await new Promise((resolve) => setTimeout(resolve, 0.1))
        }
        buffer += 1
        fetchQueue.push(
          test(moduleCode, i)
            .then(() => {
              // console.log('exit with status', status)
              buffer -= 1
            })
            .catch(() => {
              buffer -= 1
              // fails on workload is a string
              log.red(moduleCode)
              throw new Error(`failed loading ${moduleCode}`)
            })
        )
      }
      await Promise.all(fetchQueue)
      await Promise.all(writeQueue)
    })
  }
}
