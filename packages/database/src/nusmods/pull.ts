import { ModuleCondensed, Module } from '../entity'
import { listModuleCodes } from '../modules'
import { log } from '../cli'
import { fetch } from './fetch'

import { AppDataSource } from '../data-source'
import { nusmodsApi } from './utils'
import axios from 'axios'

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

  export const module = async(): Promise<Module[]> => {
    // get ModuleCondensed and Module lists from DB
    await AppDataSource.initialize()
    const moduleCondensedList: ModuleCondensed[] = await AppDataSource.manager.find(ModuleCondensed) // modules in ModuleCondensed
    const moduleList: Module[] = await AppDataSource.manager.find(Module) // modules in Module

    // compare to see what needs to be added
    const moduleCondensedCodes = new Set()
    moduleCondensedList.forEach(one => {
      moduleCondensedCodes.add(one.moduleCode)
    })

    const moduleCodes = new Set()
    moduleList.forEach((one: Module) => {
      moduleCodes.add(one.moduleCode)
    })

    const difference = new Set(Array.from(moduleCondensedCodes).filter(x => !moduleCodes.has(x)))
    const diffArr = Array.from(difference)

    // pull necessary mods from NUSMods
    const LIMIT = 100;
    let moduleInfo: Module[] = []
    while (diffArr.length > 0) {
      let count = Math.min(LIMIT, diffArr.length);
      let calls = []
      while (count > 0) {
        const moduleCode = diffArr.shift();
        calls.push(axios.get(nusmodsApi(`modules/${moduleCode}`)))
        count--;
      }
      const res = await Promise.all(calls);
      res.forEach(one => {
        const data = one.data;

        const module = new Module();
        module.acadYear = data.acadYear || '',
          module.moduleCode = data.moduleCode || '',
          module.title = data.title || '',
          module.description = '',
          module.moduleCredit = data.moduleCredit || '',
          module.department = data.department || '',
          module.faculty = data.faculty || '',
          module.workload = data.workload || '',
          module.aliases = data.aliases || [],
          module.attributes = data.attributes || {},
          module.prerequisite = data.prerequisite || '',
          module.corequisite = data.corequisite || '',
          module.preclusion = data.preclusion || '',
          module.semesterData = data.semesterData || [],
          module.prereqTree = data.prereqTree || '',
          module.fulfillRequirements = data.fulfillRequirements || []

        moduleInfo.push(module);
      });
      console.log(moduleInfo)
      // save data to DB
      await AppDataSource.manager.save(moduleInfo)

      moduleInfo = []
    }

    // list all modules in DB
    const modules = await AppDataSource.manager.find(Module)
    console.log('Final modules.length: ', modules.length)

    return modules;
  }
}
