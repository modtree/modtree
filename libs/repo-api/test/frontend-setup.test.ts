import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '../src'
import '@modtree/test-env/jest'
import { flatten } from '@modtree/utils'

const dbName = 'modtree'
const db = getSource(dbName)

let api: Api

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
  })
)

test('runs with no errors', async () => {
  await expect(api.frontendSetup()).resolves.not.toThrowError()
})

test('has 3 users', async () => {
  await Repo.User.count().then((count) => {
    expect(count).toEqual(3)
  })
})

test('has 3 degrees', async () => {
  await Repo.Degree.count().then((count) => {
    expect(count).toEqual(3)
  })
})

test('has 3 graphs', async () => {
  await Repo.Graph.count().then((count) => {
    expect(count).toEqual(3)
  })
})

test('degree titles are correct', async () => {
  await Repo.Degree.find().then((degrees) => {
    const titles = degrees.map((d) => d.title)
    expect(titles).toIncludeSameMembers([
      'Data Analytics',
      'Improvisation',
      'Paleontology',
    ])
  })
})

test('Chandler is doing Data Analytics', async () => {
  await Repo.User.findOneOrFail({
    where: { email: 'chandler@bing.com' },
    relations: { savedDegrees: true },
  }).then((user) => {
    const degree = user.savedDegrees[0]
    expect(degree.title).toEqual('Data Analytics')
  })
})

test('Chandler has correct mods', async () => {
  await Repo.User.findOneOrFail({
    where: { email: 'chandler@bing.com' },
    relations: { savedDegrees: { modules: true } },
  }).then((user) => {
    const degree = user.savedDegrees[0]
    expect(degree.modules.map(flatten.module)).toIncludeSameMembers([
      'DSA1101',
      'CS2040',
      'DSA2101',
      'DSA2102',
      'MA2001',
      'MA2002',
      'MA2311',
      'ST2131',
      'ST2132',
      'CS3244',
      'DSA3101',
      'DSA3102',
      'ST3131',
    ])
  })
})
