expect('this').not.toBe('commented')

// import { Module, ModuleCondensed } from '@modtree/entity'
// import { Repo, setup, teardown } from '@modtree/test-env'
// import { getSource } from '@modtree/typeorm-config'
// import { IModuleCondensedRepository, IModuleRepository } from '@modtree/types'
// import { oneUp } from '@modtree/utils'
// import fs from 'fs'
// import { join } from 'path'
//
// const dbName = oneUp(__filename)
// const db = getSource(dbName)
// let moduleRepo: IModuleRepository
// let moduleCondensedRepo: IModuleCondensedRepository
//
// beforeAll(() =>
//   setup(db).then(() => {
//     moduleRepo = Repo.Module
//     moduleCondensedRepo = Repo.ModuleCondensed
//   })
// )
// afterAll(() => teardown(db))
//
// describe('modules', () => {
//   let modules: Module[]
//   it('gets all module info', async () => {
//     await moduleRepo.find().then((res) => {
//       modules = res
//       expect(res).toBeArrayOf(Module)
//     })
//     fs.writeFileSync(join(__dirname, 'modules.json'), JSON.stringify(modules))
//   })
// })
//
// describe('modules condensed', () => {
//   let modules: ModuleCondensed[]
//   it('gets all module info', async () => {
//     await moduleCondensedRepo.find().then((res) => {
//       modules = res
//       expect(res).toBeArrayOf(ModuleCondensed)
//     })
//     fs.writeFileSync(
//       join(__dirname, 'modules-condensed.json'),
//       JSON.stringify(modules)
//     )
//     fs.writeFileSync(
//       join(__dirname, 'module-codes.json'),
//       JSON.stringify(modules.map((m) => m.moduleCode))
//     )
//   })
// })
