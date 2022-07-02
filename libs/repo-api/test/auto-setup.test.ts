import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '../src'
import '@modtree/test-env/jest'
import { User, Degree, Graph } from '@modtree/entity'
import { routes } from '../src/routes'
import { postman } from '../src/postman'
import fs from 'fs'
import { join } from 'path'

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
    const res = await api.autoSetup()
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

  test.each(routes)('%p %p', async (method, route, routeInfo) => {
    // unpack data
    const url = routeInfo.url
    const params = routeInfo.params

    // make request
    const res = await postman.get(url, { params })

    const data = {
      method: res.config.method,
      url: res.config.url,
      res: res.data,
    }
    all.push(data)

    expect(1).toEqual(1)
  })

  test('write to file', () => {
    const rootDir = join(__dirname, '../../..')
    const json = JSON.stringify(all, null, 2)
    fs.writeFileSync(join(rootDir, 'references/api.json'), json)

    expect(1).toEqual(1)
  })
})
