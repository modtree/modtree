import { opts } from './parser'
import { getTestsJson } from './utils'
import { spawn } from 'child_process'
import { log } from '../utils'

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

const jestArgs = {
  testPathPattern: opts.match ? ['--testPathPattern', opts.match] : [],
  projects: projectPaths.length > 0 ? ['--projects', ...projectPaths] : [],
}

const spawnArgs = ['jest', ...jestArgs.projects, ...jestArgs.testPathPattern]

if (spawnArgs.length === 1) {
  // TODO: display help message here
  log.warn('No arguments supplied')
} else {
  spawn('yarn', spawnArgs, { stdio: 'inherit' })
}
