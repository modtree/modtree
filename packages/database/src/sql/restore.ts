import { exec } from '../shell'
import { config } from '../config'
import { join } from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { sql } from '.'

/* grab project root directory
 * note that this only works because `yarn restore`
 * is saved as a package.json script, and so it's always
 * ran from project root.
 */
const sqlDir = join(config.rootDir, '.sql')

/* grab a list of all .sql files */
const sqlList = fs.readdirSync(sqlDir).filter((x) => x.endsWith('.sql'))

type Answers = {
  sql: string
  confirm: 'yes' | 'no'
}

export namespace restore {
  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  export async function file(database: string, filename: string) {
    await sql.clearDatabase(database)
    const sqlFilepath = join(sqlDir, filename)
    const cmd = `mysql -u ${config.username} -p"${config.password}" ${database} < ${sqlFilepath}`
    await exec(cmd)
  }

  /** interactive prompt to guide the user to restore an SQL database */
  export function prompted() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'sql',
          message: 'Restore from .sql file?',
          choices: sqlList,
        },
        {
          type: 'list',
          name: 'confirm',
          message: `Confirm overwrite database [${config.database}]?`,
          choices: ['yes', 'no'],
        },
      ])
      .then(async (answers: Answers) => {
        if (answers.confirm === 'no') {
          console.log('cancelled.')
          return
        }
        await sql.clearDatabase(config.database)
        const sqlFilepath = join(sqlDir, answers.sql)
        const cmd = `mysql -u ${config.username} -p"${config.password}" ${config.database} < ${sqlFilepath}`
        await exec(cmd)
      })
  }
}
