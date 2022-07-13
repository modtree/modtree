import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const find: jest.SpyInstance = jest.spyOn(api.userRepo, 'find')

test('`find` is called once', async () => {
  await request(app)
    .get('/users')
    .query({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })

  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await request(app)
    .get('/users')
    .query({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })

  expect(find).toBeCalledWith({
    where: {
      id: '58201858-5ce5-4ceb-8568-eecf55841b9f',
      authZeroId: undefined,
      email: undefined,
    },
    relations: {
      modulesDone: true,
      modulesDoing: true,
      savedDegrees: true,
      savedGraphs: true,
      mainDegree: true,
      mainGraph: true,
    },
  })
})
