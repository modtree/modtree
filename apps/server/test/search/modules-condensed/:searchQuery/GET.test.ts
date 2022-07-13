import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Like } from 'typeorm'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const find: jest.SpyInstance = jest.spyOn(api.moduleCondensedRepo, 'find')

const testRequest = () => request(app).get('/search/modules-condensed/CS1010')

test('`find` is called once', async () => {
  await testRequest()
  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await testRequest()

  expect(find).toBeCalledWith({
    where: { moduleCode: Like('CS1010%') },
    take: 10,
  })
})
