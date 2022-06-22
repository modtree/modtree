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
    findOneById = jest.spyOn(api.userRepo, 'findOneById')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

test('`findOneById` is called once', async () => {
  await request(app).get('/users/924a4c06-4ccb-4208-8791-ecae4099a763')

  expect(findOneById).toBeCalledTimes(1)
})

test('`findOneById` is called with correct args', async () => {
  await request(app).get('/users/924a4c06-4ccb-4208-8791-ecae4099a763')

  expect(findOneById).toBeCalledWith('924a4c06-4ccb-4208-8791-ecae4099a763')
})
