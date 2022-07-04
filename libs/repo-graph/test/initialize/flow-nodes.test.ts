import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { teardown, Repo, t, setup } from '@modtree/test-env'
import { graphInitializeSetup } from './setup'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(graphInitializeSetup)
    .then(() =>
      Repo.Graph.initialize({
        userId: t.user!.id,
        degreeId: t.degree!.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: true,
      }).then((graph) => {
        t.graph = graph
      })
    )
)
afterAll(() => teardown(db))

test('base', () => {
  expect(t.graph).toBeDefined()
})
