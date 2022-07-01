import { DataSource } from 'typeorm'
import { Module } from '@modtree/entity'
import { ModuleRepository } from '@modtree/repo-module'
import { empty } from '@modtree/utils'
import '@modtree/test-env/jest'

function getFakeDb(): any {
  const realDb = new DataSource({
    database: 'yes',
    type: 'postgres',
    entities: [Module],
  })
  let db: any
  db = realDb
  db.getMetadata = () => ({
    relations: [],
  })
  return db
}

const db = getFakeDb()

const moduleRepo = new ModuleRepository(db)
moduleRepo.find = async () => [
  {
    ...empty.Module,
    moduleCode: 'yes',
  },
  {
    ...empty.Module,
    moduleCode: 'no',
  },
]

test('base', async () => {
  expect(1).toBe(1)
  await moduleRepo.getCodes().then((res) => {
    console.log(res)
    expect(res).toHaveLength(2)
    expect(res).toIncludeSameMembers(['yes', 'no'])
    console.log(res.length)
  })
})
