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
let findOneOrFail: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneOrFail = jest.spyOn(api.degreeRepo, 'findOneOrFail')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

test('`findOneOrFail` is called once', async () => {
  await request(app).get(
    '/degree/58201858-5ce5-4ceb-8568-eecf55841b9f/get-full'
  )

  expect(findOneOrFail).toBeCalledTimes(1)
})

/**
 * TODO: this should return 404
 */
test('returns 500', async () => {
  const res = await request(app).get(
    '/degree/58201858-5ce5-4ceb-8568-eecf55841b9f/get-full'
  )

  expect(res.statusCode).toBe(500)
})
