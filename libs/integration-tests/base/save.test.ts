import { setup, teardown } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { BaseRepo } from '@modtree/repos'
import { Degree, Module } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let baseRepo: BaseRepo<Degree>
let created: Degree
let saved: Degree

const mod = (moduleCode: string): Module =>
  Object.assign(new Module(), { moduleCode })

beforeAll(() =>
  setup(db).then(() => {
    baseRepo = new BaseRepo(Degree, db)
    created = baseRepo.create({
      title: 'degree-title',
      modules: [mod('MA1100'), mod('CS1010')],
    })
  })
)
afterAll(() => teardown(db))

// table should initially be empty
test('db count = 0', () => baseRepo.count().then((c) => expect(c).toBe(0)))

// saving should return a typed entity
test('returns a Degree', () =>
  baseRepo.save(created).then((res) => {
    expect(res).toBeInstanceOf(Degree)
    saved = res
  }))

// table should now hold the saved entity
test('db count = 1', () => baseRepo.count().then((c) => expect(c).toBe(1)))

// an id should be created
test('generates id', () => {
  expect(saved).toHaveProperty('id')
})

// id should be a UUID
test('id is UUID', () => {
  expect(saved.id).toHaveLength(36)
  expect(saved.id).toMatch(/^.*-.*-.*-.*-.*$/)
})

// title is correct
test('correct title', () => expect(saved.title).toBe('degree-title'))

// modules are correct
test('correct modules', () =>
  expect(saved.modules).toStrictEqual(
    expect.arrayContaining([
      expect.objectContaining({ moduleCode: 'MA1100' }),
      expect.objectContaining({ moduleCode: 'CS1010' }),
    ])
  ))
