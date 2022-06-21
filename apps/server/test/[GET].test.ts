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

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
  })
)
afterAll(() => teardown(db))

test('base response', async () => {
  const response = await request(app).get('/')
  expect(response.statusCode).toBe(200)
})
