import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const _delete: jest.SpyInstance = jest.spyOn(api.graphRepo, 'delete')

const testRequest = async () =>
  request(app).delete('/graph/58201858-5ce5-4ceb-8568-eecf55841b9f')

test('`_delete` is called once', async () => {
  await testRequest()

  expect(_delete).toBeCalledTimes(1)
})

test('`_delete` is called with correct args', async () => {
  await testRequest()

  expect(_delete).toBeCalledWith({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })
})
