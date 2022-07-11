import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneByCode: jest.SpyInstance = jest.spyOn(
  api.moduleFullRepo,
  'findOneByCode'
)

const testRequest = () => request(app).get('/module-full/MA1100')

test('`findOneByCode` is called once', async () => {
  await testRequest()
  expect(findOneByCode).toBeCalledTimes(1)
})

test('`findOneByCode` is called with correct args', async () => {
  await testRequest()

  expect(findOneByCode).toBeCalledWith('MA1100')
})
