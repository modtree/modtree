import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'
import '@modtree/test-env/jest'
import { User, Degree, Graph } from '@modtree/entity'
import { auto } from '../src/init'

const dbName = 'modtree'
const db = getSource(dbName)

let api: Api

let u1: User
let u2: User
let d1: Degree
let d2: Degree
let g1: Graph
let g2: Graph

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
  })
)

describe('bare minimum', () => {
  test('runs with no errors', async () => {
    const res = await api.autoSetup(auto)
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
