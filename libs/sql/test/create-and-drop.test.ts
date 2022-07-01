import { sql } from '../src'

test('create and drop', () => {
  expect(1).toBe(1)
})

test('database initially doesnt exist', async () => {
  await sql.hasDatabase('sql_unit_test').then((res) => {
    expect(res).toBe(false)
  })
})

test('database exists after creating', async () => {
  await sql
    .createDatabase('sql_unit_test')
    .then(() => sql.hasDatabase('sql_unit_test'))
    .then((res) => expect(res).toBe(true))
})

test('database gone after dropping', async () => {
  await sql
    .dropDatabase('sql_unit_test')
    .then(() => sql.hasDatabase('sql_unit_test'))
    .then((res) => expect(res).toBe(false))
})
