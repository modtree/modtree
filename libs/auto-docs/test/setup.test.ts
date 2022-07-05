import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'
import '@modtree/test-env/jest'
import { User, Degree, Graph } from '@modtree/entity'
import { init } from '../src/init'
import { JestEach, routes } from '../src/routes'
import { postman } from '../src/postman'
import fs from 'fs'
import { join } from 'path'
import { isEntityCreation } from '../src/utils'

const dbName = 'modtree'
const db = getSource(dbName)

let api: Api

let u1: User
let u2: User
let d1: Degree
let d2: Degree
let g1: Graph
let g2: Graph

jest.setTimeout(60000)

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
  })
)

let serverRunning = false

test('server is running', async () => {
  const res = await postman.get('/')
  expect(res.status).toEqual(200)
  expect(res.data).toEqual('modtree server is running')
  serverRunning = true
})

describe('entity check', () => {
  test('runs with no errors', async () => {
    const res = await api.autoSetup(init)
    expect(Object.keys(res)).toHaveSameKeysAs([
      'u1',
      'u2',
      'd1',
      'd2',
      'g1',
      'g2',
    ])
    // unpack data
    u1 = res.u1
    u2 = res.u2
    d1 = res.d1
    d2 = res.d2
    g1 = res.g1
    g2 = res.g2
  })

  test('has 2 users', async () => {
    await Repo.User.count().then((count) => {
      expect(count).toEqual(2)
    })
  })

  test('has 2 degrees', async () => {
    await Repo.Degree.count().then((count) => {
      expect(count).toEqual(2)
    })
  })

  test('has 2 graphs', async () => {
    await Repo.Graph.count().then((count) => {
      expect(count).toEqual(2)
    })
  })
})

describe('properties checks', () => {
  let userKeys: string[]
  let degreeKeys: string[]
  let graphKeys: string[]

  test('modtree entities have keys', () => {
    userKeys = Object.keys(Repo.User.metadata.propertiesMap)
    degreeKeys = Object.keys(Repo.Degree.metadata.propertiesMap)
    graphKeys = Object.keys(Repo.Graph.metadata.propertiesMap)
    expect(userKeys.length).toBeGreaterThan(0)
    expect(degreeKeys.length).toBeGreaterThan(0)
    expect(graphKeys.length).toBeGreaterThan(0)
  })

  test('each entity instance has all keys', () => {
    expect(Object.keys(u1)).toIncludeSameMembers(userKeys)
    expect(Object.keys(u2)).toIncludeSameMembers(userKeys)
    expect(Object.keys(d1)).toIncludeSameMembers(degreeKeys)
    expect(Object.keys(d2)).toIncludeSameMembers(degreeKeys)
    expect(Object.keys(g1)).toIncludeSameMembers(graphKeys)
    expect(Object.keys(g2)).toIncludeSameMembers(graphKeys)
  })

  test('user array properties have at least one child', () => {
    ;[u1, u2].forEach((one) => {
      Object.entries(one).forEach(([_, value]) => {
        if (Array.isArray(value)) expect(value.length).toBeGreaterThan(0)
      })
    })
  })

  test('degree array properties have at least one child', () => {
    ;[d1, d2].forEach((one) => {
      Object.entries(one).forEach(([_, value]) => {
        if (Array.isArray(value)) expect(value.length).toBeGreaterThan(0)
      })
    })
  })

  test('graph array properties have at least one child', () => {
    ;[g1, g2].forEach((one) => {
      Object.entries(one).forEach(([_, value]) => {
        if (Array.isArray(value)) expect(value.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('samples', () => {
  const all: any[] = []

  // Map routes into Jest requirements
  const tests: JestEach[] = routes.map((r) => [
    r.method,
    r.route,
    {
      url: r.url,
      params: r.params,
    },
  ])

  // In the tests, there is a single POST test per entity,
  // that creates a new object.
  //
  // After this POST test and before the next POST test,
  // there is most likely a DELETE test. In order to prevent side-effects,
  // such as cascade deleting, or having to clear relations, the
  // DELETE test will be performed on the newly POSTed object.
  //
  // This ID saves that ID for future use for DELETE.
  let id: string

  test.each(tests)('%p %p', async (method, route, routeInfo) => {
    // 1. Prepare request

    // ---- unpack data
    let url = routeInfo.url || route
    const params = routeInfo.params

    // ---- fill in path params if required
    if (method === 'delete') {
      url = url.replaceAll(':userId', id)
      url = url.replaceAll(':degreeId', id)
      url = url.replaceAll(':graphId', id)
    } else {
      url = url.replaceAll(':userId', u1.id)
      url = url.replaceAll(':degreeId', d1.id)
      url = url.replaceAll(':graphId', g1.id)
      url = url.replaceAll(':authZeroId', u1.authZeroId)
    }

    // ---- fill in query params if required
    if (params) {
      if (params.hasOwnProperty('degreeIds')) {
        // used in:
        // - degree list
        // - user add degree
        params['degreeIds'].push(d2.id)
      }
      if (params.hasOwnProperty('graphIds')) {
        // used in:
        // - user add graph
        params['graphIds'].push(g2.id)
      }
      if (params.hasOwnProperty('degreeId')) {
        // used in:
        // - user set main degree
        params['degreeId'] = d2.id
      }
      if (params.hasOwnProperty('graphId')) {
        // used in:
        // - user set main graph
        params['graphId'] = g2.id
      }
      if (method === 'post' && route === '/graph') {
        // used in:
        // - create graph
        params['userId'] = u1.id
        params['degreeId'] = d1.id
      }
    }

    // 2. Make request
    const res = await postman.send(method, url, params)

    // 3. Transform data
    const data = {
      method: res.config.method,
      url: res.config.url,
      res: res.data,
    }

    all.push(data)

    // 4. Save ID if created new entity
    if (isEntityCreation(method, route)) {
      id = res.data.id
    }

    expect(1).toEqual(1)
  })

  test('write to file', () => {
    if (serverRunning) {
      const rootDir = join(__dirname, '../../..')
      const json = JSON.stringify(all, null, 2)
      fs.writeFileSync(join(rootDir, 'references/api.json'), json)
    }

    expect(1).toEqual(1)
  })
})
