import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'
import { db } from '@modtree/typeorm-config'

let app: Express
let api: Api
let findOneByCode: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneByCode = jest.spyOn(api.moduleFullRepo, 'findOneByCode')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () => request(app).get('/module-full/MA1100')

test('`findOneByCode` is called once', async () => {
  await testRequest()
  expect(findOneByCode).toBeCalledTimes(1)
})

test('`findOneByCode` is called with correct args', async () => {
  await testRequest()

  expect(findOneByCode).toBeCalledWith('MA1100')
})
