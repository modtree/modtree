import { ModuleCondensed } from '@modtree/entity'
import { setup, teardown, Repo, t } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let count: number
const m = new ModuleCondensed()
m.id = '58201858-5ce5-4ceb-8568-eecf55841b9f'
m.title = 'Change-inator-inator'
m.moduleCode = 'TST1000MD'

beforeAll(() => setup(db))
afterAll(() => teardown(db))

it('initial count', async () => {
  await Repo.ModuleCondensed.count().then((c) => {
    expect(c).toBeGreaterThan(6000)
    count = c
  })
})

it('returns a module', async () => {
  await Repo.ModuleCondensed.initialize(m).then((res) => {
    expect(res).toBeInstanceOf(ModuleCondensed)
    t.modulesCondensed = [res]
  })
})

it('increments the count by 1', async () => {
  await Repo.ModuleCondensed.count().then((c) => {
    expect(c).toEqual(count + 1)
  })
})

it('saves correct information', async () => {
  const module = t.modulesCondensed![0]
  expect(module.moduleCode).toBe('TST1000MD')
  expect(module.title).toBe('Change-inator-inator')
})
