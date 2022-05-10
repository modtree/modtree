import { ModuleCondensed } from '../entity'
import { listModuleCodes } from '../modules'
import { log } from '../cli'
import { fetch } from './fetch'

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
}
