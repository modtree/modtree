import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'
import { Like } from 'typeorm'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let app: Express
let api: Api
let find: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    find = jest.spyOn(api.moduleCondensedRepo, 'find')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () => request(app).get('/modules-condensed/search/CS1010')

test('`find` is called once', async () => {
  await testRequest()
  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await testRequest()

  expect(find).toBeCalledWith({ where: { moduleCode: Like('CS1010%') } })
})
