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
let findOneByOrFail: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneByOrFail = jest.spyOn(api.moduleCondensedRepo, 'findOneByOrFail')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () => request(app).get('/module-condensed/MA1100')

test('`findOneByOrFail` is called once', async () => {
  await testRequest()
  expect(findOneByOrFail).toBeCalledTimes(1)
})

test('`findOneByOrFail` is called with correct args', async () => {
  await testRequest()

  expect(findOneByOrFail).toBeCalledWith({ moduleCode: 'MA1100' })
})
