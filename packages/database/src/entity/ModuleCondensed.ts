import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { getModuleLevel, nusmodsApi } from '../utils/string'
import { log } from '../cli'
import {
  ModuleCode,
  ModuleTitle,
  ModuleCondensed as NMC,
} from '../../types/nusmods'
import { AppDataSource, container } from '../data-source'
import axios from 'axios'

type Props = {
  moduleCode: ModuleCode
  title: ModuleTitle
}

@Entity({ name: 'moduleCondensed' })
export class ModuleCondensed {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  moduleCode: ModuleCode

  // Numeric part of moduleCode
  @Column()
  moduleLevel: number

  @Column()
  title: ModuleTitle

  /**
   * a drop-in replacement of a constructor
   * @param {Props} props
   * @return {ModuleCondensed}
   */
  static new(props: Props): ModuleCondensed {
    const m = new ModuleCondensed()
    m.title = props.title || ''
    m.moduleCode = props.moduleCode || ''
    m.moduleLevel = getModuleLevel(m.moduleCode)
    return m
  }
  /**
   * get all condensed modules in the database
   * @return {Promise<ModuleCondensed[]>}
   */
  static async get(): Promise<ModuleCondensed[]> {
    const modules = await container(async () => {
      const repo = AppDataSource.getRepository(ModuleCondensed)
      const modules = await repo.find().catch((err) => {
        log.warn('Warning: failed to get ModuleCondensed from database.')
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
   * get module codes from the moduleCondensed table
   * @return {Promise<Set<string>>}
   */
  static async getCodes(): Promise<Set<string>> {
    const modules = await ModuleCondensed.get()
    const codes = modules.map((m) => m.moduleCode)
    return new Set(codes)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  static async fetch(): Promise<ModuleCondensed[]> {
    /* this line is required for JEST. Wihtout awaiting nextTick,
     * the next line will somehow trigger JEST's open handle catcher.
     */
    await process.nextTick(() => true)
    const res = await axios.get(nusmodsApi('moduleList'))
    const data: NMC[] = res.data
    return data.map((n) => ModuleCondensed.new(n))
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  static async pull(): Promise<ModuleCondensed[]> {
    const existingModules = new Set(
      (await ModuleCondensed.get()).map((m) => m.moduleCode)
    )
    const freshModules = await ModuleCondensed.fetch()
    const modulesToSave = freshModules.filter(
      (x) => !existingModules.has(x.moduleCode)
    )
    await AppDataSource.manager.save(modulesToSave)
    return modulesToSave
  }
}
