import { AppDataSource, container, endpoint } from '../src/data-source'
import { ModuleRepository } from '../src/repository/Module'
import { setup } from './setup'

beforeAll(async () => {
  await setup()
})

test('basic repository operations', async () => {
  await container(async () => {
    const results = await ModuleRepository.findByFaculty('Computing')
    console.log(results.map(x => x.moduleCode))
  })
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
  }
  expect(1).toBe(1)
})
