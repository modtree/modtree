import { Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let id: string
let title: string

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('grab an id', async () => {
  await Repo.Module.find({ take: 1 }).then((module) => {
    expect(typeof module[0].id).toBe('string')
    id = module[0].id
    title = module[0].title
  })
})

test('retrieves correct title', async () => {
  await Repo.Module.findOneById(id).then((module) => {
    expect(module.title).toEqual(title)
  })
})
