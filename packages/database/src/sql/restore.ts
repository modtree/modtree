import { exec } from '../shell'
import { config } from '../config'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { log } from '../cli'

/* grab project root directory
 * note that this only works because `yarn restore`
 * is saved as a package.json script, and so it's always
 * ran from project root.
 */
const sqlDir = path.join(config.rootDir, '.sql')

/* grab a list of all .sql files */
const sqlList = fs.readdirSync(sqlDir).filter(x => x.endsWith('.sql'))

type Answers = {
  sql: string
  confirm: 'yes' | 'no'
}

export namespace restore {
  export async function file (filename: string) {
    const sqlFilepath = path.join(sqlDir, filename)
    const cmd = `mysql -u ${config.username} -p"${config.password}" ${config.database} < ${sqlFilepath}`
    log.cyan(`restoring from ${sqlFilepath}`)
    await exec(cmd)
  }

  export const prompted = () => {
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
        const sqlFilepath = path.join(sqlDir, answers.sql)
        const cmd = `mysql -u ${config.username} -p"${config.password}" ${config.database} < ${sqlFilepath}`
        await exec(cmd)
      })
  }

}
