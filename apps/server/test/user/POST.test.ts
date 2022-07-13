import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const initialize: jest.SpyInstance = jest.spyOn(api.userRepo, 'initialize')

test('`initialize` is called once', async () => {
  await request(app).post('/user').send({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
  })

  expect(initialize).toBeCalledTimes(1)
})

test('`initialize` is called with correct args', async () => {
  await request(app).post('/user').send({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
  })

  expect(initialize).toBeCalledWith({
    authZeroId: 'auth0|012345678901234567890123',
    email: 'test@test.test',
  })
})
