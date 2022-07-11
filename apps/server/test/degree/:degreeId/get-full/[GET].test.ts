import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneOrFail: jest.SpyInstance = jest.spyOn(
  api.degreeRepo,
  'findOneOrFail'
)

test('`findOneOrFail` is called once', async () => {
  await request(app).get(
    '/degree/58201858-5ce5-4ceb-8568-eecf55841b9f/get-full'
  )

  expect(findOneOrFail).toBeCalledTimes(1)
})

/**
 * TODO: this should return 404
 */
test('returns 500', async () => {
  const res = await request(app).get(
    '/degree/58201858-5ce5-4ceb-8568-eecf55841b9f/get-full'
  )

  expect(res.statusCode).toBe(500)
})
