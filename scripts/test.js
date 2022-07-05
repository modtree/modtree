const chalk = require('chalk')

const path = require('path')

process.chdir(path.resolve(__dirname, '..'))

const projectMap = {
  mc: 'libs/repos/src/module-condensed/test',
  m: 'libs/repos/src/module/test',
  user: 'libs/repos/src/user/test',
  degree: 'libs/repos/src/degree/test',
  graph: 'libs/repos/src/graph/test',
  u: 'libs/repos/src/user/test',
  d: 'libs/repos/src/degree/test',
  g: 'libs/repos/src/graph/test',
  utils: 'libs/utils',
}

const raw = process.argv.slice(2)
const args = []
const projects = []

const projectSet = new Set(Object.keys(projectMap))
raw.forEach((a) => {
  if (!projectSet.has(a)) {
    console.debug(a, chalk.yellow('is an invalid project.\n'))
    console.debug(chalk.green('Pick a project from this list:'))
    console.debug(projectMap)
    process.exit(1)
  }
  projects.push(projectMap[a])
})

console.debug(['--color', '--projects', ...projects, ...args].join(' '))
