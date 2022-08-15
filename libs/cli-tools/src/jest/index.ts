import { opts } from './parser'
import { getTestsJson } from './utils'
import { spawn } from 'child_process'

const { jestProjects, aliases, groups } = getTestsJson()

/**
 * get list of project paths to test
 */
const projectPaths = opts.positionalArgs
  // expand test groups
  .reduce<string[]>((acc, t) => {
    const group = groups[t]
    return group ? [...acc, ...group.tests] : [...acc, t]
  }, [])
  .reduce<string[]>((acc, t) => {
    // direct read from jestProject
    const jestProject = jestProjects[t]
    if (jestProject) return [...acc, jestProject]
    // read from aliases
    const aliasedProject = jestProjects[aliases[t]]
    if (aliasedProject) return [...acc, aliasedProject]
    // skip this positional argument
    return acc
  }, [])

const testPathPattern = opts.match ? ['--testPathPattern', opts.match] : []
const spawnArgs = ['jest', ...projectPaths, ...testPathPattern]

console.log(spawnArgs)

// spawn('yarn', spawnArgs, { stdio: 'inherit' })
// spawn('ls', { stdio: 'inherit' })

// if (!args.tail.includes('--dr')) {
//   fs.writeFileSync('test.command', spawnArgs.join(' '))
// }
