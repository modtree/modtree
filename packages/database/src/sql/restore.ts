import { exec } from 'child_process'
import { config } from '../config'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'

/* grab project root directory
 * note that this only works because `yarn restore`
 * is saved as a package.json script, and so it's always
 * ran from project root.
 */
const projectRoot = process.cwd()
const sqlDir = path.join(projectRoot, '.sql')

/* grab a list of all .sql files */
const sqlList = fs.readdirSync(sqlDir)

type Answers = {
  sql: string
  confirm: 'yes' | 'no'
}

export const restore = () => {
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
      exec(cmd)
    })
}
