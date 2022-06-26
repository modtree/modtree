/**
 * this is in-liew of a real globalSetup
 */

import { sql } from '@modtree/sql'
import { db, config } from '@modtree/typeorm-config'

test(`database: ${db.options.database}`, () => {
  expect(db.options.database).toBeDefined()
})

test('restore database', async () => {
  await expect(
    sql.restoreFromFile(db.options.database!.toString(), config.restoreSource)
  ).resolves.not.toThrowError()
})
