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
let userLogin: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    userLogin = jest.spyOn(api, 'userLogin')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () =>
  request(app)
    .post('/user/auth0|012345678901234567890123/login')
    .send({ email: 'test@test.test' })

test('`userLogin` is called once', async () => {
  await testRequest()

  expect(userLogin).toBeCalledTimes(1)
})

test('`userLogin` is called with correct args', async () => {
  await testRequest()

  expect(userLogin).toBeCalledWith(
    'auth0|012345678901234567890123',
    'test@test.test'
  )
})
