import { setup, teardown } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { BaseRepo } from '@modtree/repos'
import { Degree, Module } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let baseRepo: BaseRepo<Degree>

const M = (moduleCode: string): Module =>
  Object.assign(new Module(), { moduleCode })

beforeAll(() =>
  setup(db).then(() => {
    baseRepo = new BaseRepo(Degree, db)
  })
)
afterAll(() => teardown(db))

const correct = [
  {
    type: 'full props',
    title: 'degree-title',
    modules: [M('MA1100'), M('CS1010')],
  },
  {
    type: 'empty title',
    title: '',
    modules: [M('MA1100')],
  },
  {
    type: 'no title',
    modules: [M('MA1100')],
  },
  {
    type: 'no title nor modules',
    modules: [],
  },
  { type: 'absolutely nothing' },
]

test.each(correct)('works with $type', (props) => {
  const { type, ...init } = props
  expect(baseRepo.create(init)).toBeInstanceOf(Degree)
})
