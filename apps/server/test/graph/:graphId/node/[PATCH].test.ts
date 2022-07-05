import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { getSource } from '@modtree/typeorm-config'
import { empty, oneUp } from '@modtree/utils'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repos'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let app: Express
let api: Api
let findOneById: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneById = jest.spyOn(api.graphRepo, 'findOneById')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

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
