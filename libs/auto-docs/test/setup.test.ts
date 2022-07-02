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
import { RouteMethod } from '@modtree/types'

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

describe('bare minimum', () => {
  test('runs with no errors', async () => {
    const res = await api.autoSetup(init)
    u1 = res.u1
    u2 = res.u2
    d1 = res.d1
    d2 = res.d2
    g1 = res.g1
    g2 = res.g2
    expect(1).toEqual(1)
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

  test('get keys', () => {
    userKeys = Object.keys(Repo.User.metadata.propertiesMap)
    degreeKeys = Object.keys(Repo.Degree.metadata.propertiesMap)
    graphKeys = Object.keys(Repo.Graph.metadata.propertiesMap)
    expect(1).toEqual(1)
  })

  test('all properties exist', () => {
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
    }

    // make request
    const res = await postman.send(method, url, params)

    // truncate response data if necessary
    let response
    if (Array.isArray(res.data) && res.data.length > 3) {
      // if the response is an array, only give at most 3 entries
      response = [res.data[0], res.data[1], res.data[2]]
    } else {
      // otherwise just leave it
      response = res.data
    }

    // transform data
    const data = {
      method: res.config.method,
      url: res.config.url,
      res: response,
    }

    all.push(data)

    // save ID if POST, and the route is
    if (isEntityCreation(method, route)) {
      id = response.id
    }

    expect(1).toEqual(1)
  })

  test('write to file', () => {
    const rootDir = join(__dirname, '../../..')
    const json = JSON.stringify(all, null, 2)
    fs.writeFileSync(join(rootDir, 'references/api.json'), json)

    expect(1).toEqual(1)
  })
})

function isEntityCreation(method: RouteMethod, route: string) {
  return (
    // POST request
    method === 'post' &&
    // path contains 1 slash (i.e. POST /entity)
    route.split('/').length === 2
  )
}
