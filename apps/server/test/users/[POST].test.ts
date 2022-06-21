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
let initialize: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    initialize = jest.spyOn(api.userRepo, 'initialize')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

test('`initialize` is called once', async () => {
  await request(app).post('/users').send({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
  })

  expect(initialize).toBeCalledTimes(1)
})

test('`initialize` is called with correct args', async () => {
  await request(app).post('/users').send({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
  })

  expect(initialize).toBeCalledWith({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
  })
})
