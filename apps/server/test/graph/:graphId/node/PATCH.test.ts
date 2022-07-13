import { empty } from '@modtree/utils'
import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneById: jest.SpyInstance = jest.spyOn(api.graphRepo, 'findOneById')

const testRequest = async () =>
  request(app)
    .patch('/graph/017fc011-486c-4ec6-a038-9a92ab85a8f3/node')
    .send({
      flowNode: {
        id: 'CS1010S',
        position: {
          x: 0,
          y: 0,
        },
        data: {
          ...empty.Module,
          moduleCode: 'CS1010S',
        },
      },
    })

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('017fc011-486c-4ec6-a038-9a92ab85a8f3')
})
