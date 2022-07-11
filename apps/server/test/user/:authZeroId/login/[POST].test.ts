import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const userLogin: jest.SpyInstance = jest.spyOn(api, 'userLogin')

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
