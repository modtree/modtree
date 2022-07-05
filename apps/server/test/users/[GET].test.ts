import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repos'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let app: Express
let api: Api
let find: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    find = jest.spyOn(api.userRepo, 'find')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

test('`find` is called once', async () => {
  await request(app)
    .get('/users')
    .query({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })

  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await request(app)
    .get('/users')
    .query({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })

  expect(find).toBeCalledWith({
    where: { id: '58201858-5ce5-4ceb-8568-eecf55841b9f' },
    relations: {
      modulesDone: true,
      modulesDoing: true,
      savedDegrees: true,
      savedGraphs: true,
    },
  })
})
