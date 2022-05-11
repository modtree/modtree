import { ModuleCondensed as NMC, Module as NM } from '../../types/nusmods'
import { ModuleCondensed, Module } from '../entity'
import { nusmodsApi, getModuleLevel, constructModule } from './utils'
import axios from 'axios'

type FetchModuleCondensed = {
  modules: ModuleCondensed[]
  total: number
  unique: number[]
  indexed: number
}

/** fetch data from NUSMods API */
export namespace fetch {
  /**
   * fetches a list of condensed modules
   * @return {Promise<FetchModuleCondensed>}
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
   * fetches exactly one module with full details
   * @param {string} moduleCode
   */
  export async function oneModule(moduleCode: string) {
    // const test = 'MA5205'
    const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
    // const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
    const n: NM = res.data
    const m = new Module()
    constructModule(n, m)
    console.log(m)
  }
}
