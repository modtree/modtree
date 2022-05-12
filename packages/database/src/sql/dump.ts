import { exec } from 'child_process'
import { config } from '../config'
import path from 'path'
import input from '@inquirer/input'

/* grab project root directory
 * note that this only works because `yarn restore`
 * is saved as a package.json script, and so it's always
 * ran from project root.
 */
const projectRoot = process.cwd()
const sqlDir = path.join(projectRoot, '.sql')

export const dump = async () => {
  const sqlFilename = await input({ message: 'Enter .sql filename:', default: 'backup' })
  const sqlFilepath = path.join(sqlDir, `${sqlFilename}.sql`)
  const cmd = `mysqldump -u ${config.username} -p"${config.password}" ${config.database} > ${sqlFilepath}`
  exec(cmd)
}
