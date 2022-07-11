import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneByOrFail: jest.SpyInstance = jest.spyOn(
  api.moduleCondensedRepo,
  'findOneByOrFail'
)

const testRequest = () => request(app).get('/module-condensed/MA1100')

test('`findOneByOrFail` is called once', async () => {
  await testRequest()
  expect(findOneByOrFail).toBeCalledTimes(1)
})

test('`findOneByOrFail` is called with correct args', async () => {
  await testRequest()

  expect(findOneByOrFail).toBeCalledWith({ moduleCode: 'MA1100' })
})
