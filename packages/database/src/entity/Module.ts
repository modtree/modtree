import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {
  AcadYear,
  ModuleCode,
  SemesterData,
  Workload,
  PrereqTree,
  ModuleTitle,
  Department,
  Faculty,
  NUSModuleAttributes,
  Module as NM,
} from '../../types/nusmods'
import { modtree } from '../../types/modtree'
import axios from 'axios'
import { Agent } from 'https'
import { log } from '../cli'
import { AppDataSource, container } from '../data-source'
import { nusmodsApi } from '../utils/string'
import { moduleCondensed } from '../functions/moduleCondensed'

@Entity({ name: 'module' })
export class Module implements modtree.Module {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({ type: 'text' })
  acadYear: AcadYear

  @Column({ type: 'text' })
  moduleCode: ModuleCode

  @Column({ type: 'text' })
  title: ModuleTitle

  @Column({ type: 'longblob' })
  description: string

  @Column({ type: 'text' })
  moduleCredit: string

  @Column({ type: 'text' })
  department: Department

  @Column({ type: 'text' })
  faculty: Faculty

  @Column({ type: 'json' })
  aliases: ModuleCode[]

  @Column({ type: 'json' })
  attributes: NUSModuleAttributes

  @Column({ type: 'text' })
  prerequisite: string

  @Column({ type: 'text' })
  corequisite: string

  @Column({ type: 'text' })
  preclusion: string

  @Column({ type: 'json' })
  fulfillRequirements: ModuleCode[]

  @Column({ type: 'json' })
  semesterData: SemesterData[]

  @Column({ type: 'json' })
  prereqTree: PrereqTree

  @Column({ type: 'json' })
  workload: Workload

  /**
   * a drop-in replacement of a constructor
   * @param {NM} props
   * @return {Module}
   */
  static new(props: NM): Module {
    const m = new Module()
    m.acadYear = props.acadYear || ''
    m.moduleCode = props.moduleCode || ''
    m.title = props.title || ''
    m.description = props.description || ''
    m.moduleCredit = props.moduleCredit || ''
    m.department = props.department || ''
    m.faculty = props.faculty || ''
    m.workload = props.workload || ''
    m.aliases = props.aliases || []
    m.attributes = props.attributes || {}
    m.prerequisite = props.prerequisite || ''
    m.corequisite = props.corequisite || ''
    m.preclusion = props.preclusion || ''
    m.prereqTree = props.prereqTree || ''
    m.semesterData = props.semesterData || []
    m.fulfillRequirements = props.fulfillRequirements || []
    return m
  }

  /**
   * get all modules in the database
   * @return {Promise<Module[]>}
   */
  static async get(): Promise<Module[]> {
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
   * get all module codes from the module table
   * @return {Promise<Set<string>>}
   */
  static async getCodes(): Promise<Set<string>> {
    const modules = await Module.get()
    const codes = modules.map((m) => m.moduleCode)
    return new Set(codes)
  }

  /**
   * fetches exactly one module with full details
   * @param {string} moduleCode
   */
  static async fetchOne(moduleCode: string): Promise<Module> {
    /* this line is required for JEST. Wihtout awaiting nextTick,
     * the next line will somehow trigger JEST's open handle catcher.
     */
    await process.nextTick(() => true)
    const res = await axios.get(nusmodsApi(`modules/${moduleCode}`))
    const n: NM = res.data
    const m = Module.new(n)
    return m
  }

  /**
   * fetches exactly one module with full details
   */
  static async pull(): Promise<Module[]> {
    const client = axios.create({
      baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
      timeout: 60000,
      maxRedirects: 10,
      httpsAgent: new Agent({ keepAlive: true }),
    })
    const moduleCodes = await Module.getCodes()
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
