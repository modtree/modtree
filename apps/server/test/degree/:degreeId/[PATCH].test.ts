import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let app: Express
let api: Api
let findOneById: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneById = jest.spyOn(api.degreeRepo, 'findOneById')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = async () =>
  request(app)
    .patch('/degree/58201858-5ce5-4ceb-8568-eecf55841b9f')
    .send({ moduleCodes: ['CS1010', 'MA1100'] })

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('58201858-5ce5-4ceb-8568-eecf55841b9f')
})
