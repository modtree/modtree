import { ModuleCondensed as NMC, Module as NM } from '../../types/nusmods'
import { ModuleCondensed, Module } from '../entity'
import { listModuleCodes, listModules } from '../modules'
import { Agent } from 'https'
import { log } from '../cli'
import { nusmodsApi, getModuleLevel } from './utils'
import axios from 'axios'
import { constructModule } from './utils'

type FetchModuleCondensed = {
  modules: ModuleCondensed[]
  total: number
  unique: number[]
  indexed: number
}

export namespace fetch {
  /**
   * fetches a list of condensed modules
   * @returns {Promise<ModuleCondensed[]>}
   */
  export async function moduleCondensed(): Promise<FetchModuleCondensed> {
    const res = await axios.get(nusmodsApi('moduleList'))
    const data: NMC[] = res.data
    const lengths = new Set<number>()
    const outliers: string[] = []
    const modules: ModuleCondensed[] = []
    data.forEach((n) => {
      const m = new ModuleCondensed()
      const level = getModuleLevel(n.moduleCode)
      const l = level.length
      lengths.add(l)
      if (l !== 4) {
        outliers.push(n.moduleCode)
        return
      }
      m.title = n.title
      m.moduleCode = n.moduleCode
      m.moduleLevel = parseInt(level) || 0
      modules.push(m)
    })
    console.debug('unique lengths:', Array.from(lengths))
    console.debug('non-4 lengths', outliers)
    console.debug('total response', data.length)
    console.debug('total indexed', modules.length)
    return {
      modules,
      total: data.length,
      unique: Array.from(lengths),
      indexed: modules.length,
    }
  }

  /**
   * fetches a list of complete modules
   * @returns {Promise<Module[]>}
   */
  // TODO: make this fetch-only
  export async function module(n: number): Promise<Module[]> {
    const client = axios.create({
      baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
      timeout: 60000,
      maxRedirects: 10,
      httpsAgent: new Agent({ keepAlive: true }),
    })
    const toPull = await listModuleCodes()
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
}
