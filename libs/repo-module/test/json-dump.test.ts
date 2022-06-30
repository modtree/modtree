expect('this').not.toBe('commented')

import { Module, ModuleCondensed } from '@modtree/entity'
import { Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { IModuleCondensedRepository, IModuleRepository } from '@modtree/types'
import { oneUp } from '@modtree/utils'
import fs from 'fs'
import { join } from 'path'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const rootDir = join(__dirname, '../../..')
const outDir = join(rootDir, 'references')
let moduleRepo: IModuleRepository
let moduleCondensedRepo: IModuleCondensedRepository
const prettify = (s: any) => JSON.stringify(s, null, 2)

beforeAll(() =>
  setup(db).then(() => {
    moduleRepo = Repo.Module
    moduleCondensedRepo = Repo.ModuleCondensed
  })
)
afterAll(() => teardown(db))

describe('modules', () => {
  let modules: Module[]
  it('gets all module info', async () => {
    await moduleRepo.find().then((res) => {
      modules = res
      expect(res).toBeArrayOf(Module)
    })
    const minified = modules.map((m) => ({
      ...m,
      id: undefined,
    }))
    fs.writeFileSync(join(outDir, 'modules.json'), prettify(minified))
  })
})

describe('modules condensed', () => {
  let modules: ModuleCondensed[]
  it('gets all module info', async () => {
    await moduleCondensedRepo.find().then((res) => {
      modules = res
      expect(res).toBeArrayOf(ModuleCondensed)
    })
    /**
     * write data
     */
    const minified = modules.map(({ moduleCode, title }) => ({
      moduleCode,
      title,
    }))
    fs.writeFileSync(join(outDir, 'modules-condensed.json'), prettify(minified))
    fs.writeFileSync(
      join(outDir, 'module-codes.json'),
      prettify(modules.map((m) => m.moduleCode))
    )
  })
})
