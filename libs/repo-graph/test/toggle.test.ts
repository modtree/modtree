import { Graph, Module, ModuleCondensed } from '@modtree/entity'
import { init, Repo, setup, teardown, t } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { flatten, oneUp } from '@modtree/utils'
import { EntityNotFoundError } from 'typeorm'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User!.initialize(init.user1),
        Repo.Degree!.initialize(init.degree1),
      ])
    )
    .then(([user, degree]) =>
      Repo.Graph!.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: ['CM1501'],
        modulesHiddenCodes: [],
        pullAll: true,
      })
    )
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

async function findGraph(id: string) {
  return Repo.Graph!.findOneById(id)
}

async function toggle(graph: Graph, moduleCode: string) {
  return Repo.Graph!.toggleModule(graph, moduleCode)
}

test('MA2001 is hidden', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesHidden.map(flatten.module)
    expect(codes).toContain('MA2001')
  })
})

test('toggling MA2001 returns a graph', async () => {
  await toggle(t.graph!, 'MA2001').then((graph) => {
    expect(graph).toBeInstanceOf(Graph)
  })
})

test('MA2001 becomes placed', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesPlaced.map(flatten.module)
    expect(codes).toContain('MA2001')
  })
})

test('CM1501 is placed', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesPlaced.map(flatten.module)
    expect(codes).toContain('CM1501')
  })
})

test('toggling CM1501 returns a graph', async () => {
  await toggle(t.graph!, 'CM1501').then((graph) => {
    expect(graph).toBeInstanceOf(Graph)
  })
})

test('CM1501 becomes hidden', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesHidden.map(flatten.module)
    expect(codes).toContain('CM1501')
  })
})

test('EE1111A is not placed', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesPlaced.map(flatten.module)
    expect(codes).not.toContain('EE1111A')
  })
})

test('EE1111A is not hidden', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesHidden.map(flatten.module)
    expect(codes).not.toContain('EE1111A')
  })
})

test('toggling EE1111A returns a graph', async () => {
  await toggle(t.graph!, 'EE1111A').then((graph) => {
    expect(graph).toBeInstanceOf(Graph)
  })
})

test('EE1111A becomes placed', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.modulesPlaced.map(flatten.module)
    expect(codes).toContain('EE1111A')
  })
})

test('CS420BZT is not in database', async () => {
  await expect(() =>
    Repo.ModuleCondensed!.findOneByOrFail({ moduleCode: 'CS420BZT' })
  ).rejects.toThrowError(
    new EntityNotFoundError(ModuleCondensed, {
      moduleCode: 'CS420BZT',
    })
  )
})

test('error on toggling CS420BZT', async () => {
  await expect(() =>
    Repo.Graph!.toggleModule(t.graph!, 'CS420BZT')
  ).rejects.toThrowError(
    new EntityNotFoundError(Module, {
      moduleCode: 'CS420BZT',
    })
  )
})
