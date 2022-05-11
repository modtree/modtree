import { ModuleCondensed, Module } from '../entity'
import { listModuleCodes, listModules } from '../modules'
import { log } from '../cli'
import { fetch } from './fetch'

import { AppDataSource, db } from '../data-source'
import { nusmodsApi } from './utils'
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

  export const module = async(): Promise<Module[]> => {
    // instantiate client
    const client = axios.create({
      baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
      timeout: 60000,
      maxRedirects: 10,
      httpsAgent: new Agent({ keepAlive: true }),
    })

    // get ModuleCondensed and Module lists from DB
    const moduleCondensedSet = await listModuleCodes()
    const moduleSet = await listModules()

    const difference = new Set(Array.from(moduleCondensedSet).filter(x => !moduleSet.has(x)))
    const diffArr = Array.from(difference)

    await db.open()

    // pull necessary mods from NUSMods
    const LIMIT = 100;
    let moduleInfo: Module[] = []
    let i = 0;
    while (diffArr.length > 0) {
      let count = Math.min(LIMIT, diffArr.length);
      let calls = []
      while (count > 0) {
        const moduleCode = diffArr.shift();
        calls.push(client.get(nusmodsApi(`modules/${moduleCode}`)))
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

      // save data to DB
      await AppDataSource.manager.save(moduleInfo)

      console.log(i*100);
      i++;
      moduleInfo = []
    }

    // list all modules in DB
    const modules = await AppDataSource.manager.find(Module)
    console.log('Final modules.length: ', modules.length)

    await db.close()

    return modules;
  }
}
