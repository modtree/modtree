import { Module } from '@modtree/entity'
import { setup, teardown, Repo, t } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let count: number
const m = new Module()
m.id = '58201858-5ce5-4ceb-8568-eecf55841b9f'
m.acadYear = ''
m.title = ''
m.description = ''
m.moduleCredit = ''
m.department = 'Tristate-Area'
m.faculty = ''
m.moduleCode = 'TST1000MD'

beforeAll(() => setup(db))
afterAll(() => teardown(db, true))

it('initial count', async () => {
  await Repo.Module.count().then((c) => {
    expect(c).toBeGreaterThan(6000)
    count = c
  })
})

it('returns a module', async () => {
  await Repo.Module.initialize(m).then((res) => {
    expect(res).toBeInstanceOf(Module)
    t.modules = [res]
  })
})

it('increments the count by 1', async () => {
  await Repo.Module.count().then((c) => {
    expect(c).toEqual(count + 1)
  })
})

it('saves correct information', async () => {
  const module = t.modules![0]
  expect(module.moduleCode).toBe('TST1000MD')
  expect(module.department).toBe('Tristate-Area')
})
