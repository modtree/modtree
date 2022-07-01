import { exec } from '@modtree/utils'
import { sql } from '../src'

test('create and drop', () => {
  expect(1).toBe(1)
})

const psql = 'PGPASSWORD=test psql -U test -h localhost -p 4001'

const has = (stdout: string) =>
  stdout.includes('template0') &&
  stdout.includes('template1') &&
  stdout.includes('sql_unit_test')

test('database initially doesnt exist', async () => {
  await exec(`${psql} -lqt`).then((res) => {
    expect(has(res.output)).toBe(false)
  })
})

test('database exists after creating', async () => {
  await sql
    .createDatabase('sql_unit_test')
    .then(() => exec(`${psql} -lqt`))
    .then((res) => expect(has(res.output)).toBe(true))
})

test('database gone after dropping', async () => {
  await sql
    .dropDatabase('sql_unit_test')
    .then(() => exec(`${psql} -lqt`))
    .then((res) => expect(has(res.output)).toBe(false))
})
