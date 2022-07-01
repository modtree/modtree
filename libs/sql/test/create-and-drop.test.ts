import { sql } from '../src'

test('create and drop', () => {
  expect(1).toBe(1)
})

test('database initially doesnt exist', async () => {
  await sql.dropDatabase('sql_test').then((res) => {
    expect(res.output).toMatch(/.*database "sql_test" does not exist.*/)
  })
})
