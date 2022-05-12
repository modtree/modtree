import path from 'path'
import fs from 'fs'

type Script = {
  name: string
  command: string
}

/**
 * returns a copy of the list to be filtered
 * @param {string[]} list
 * @param {RegExp[]} ignore: same idea as .ignore files
 * @param {string[]} blacklist
 * @returns {string}
 */
function filterList(
  list: string[],
  ignore: RegExp[],
  blacklist?: string[]
): string[] {
  return list.filter((x) => {
    // leave it out if it matches any regex in the ignore list
    for (let i = 0; i < ignore.length; i++) {
      if (x.match(ignore[i])) {
        return false
      }
    }
    // if the exact array is in anyway empty,
    // skip the check and pass the element into the new list
    if (
      blacklist === undefined ||
      blacklist === null ||
      blacklist.length === 0
    ) {
      return true
    }
    // check against the blacklist
    return !blacklist.includes(x)
  })
}

/**
 * returns a whitelisted copy of a supplied list
 * @param {string[]} list
 * @param {RegExp[]} whitelist
 * @returns {string[]}
 */
function regexMatchOneOf(list: string[], whitelist?: RegExp[]): string[] {
  if (whitelist === undefined) {
    return list
  }
  return list.filter((x) => {
    for (let i = 0; i < whitelist.length; i++) {
      if (x.match(whitelist[i])) {
        return true
      }
    }
    return false
  })
}

/**
 * indiscriminately lists all scripts in package.json
 * meant to be filtered before actual use
 * @returns {Script[]}
 */
function getAllScripts(): Script[] {
  const root = process.cwd()
  const filepath = path.join(root, 'package.json')
  const rawData = fs.readFileSync(filepath).toString()
  const packageJson = JSON.parse(rawData)
  const entries: [string, string][] = Object.entries(packageJson.scripts)
  const scriptList: Script[] = entries.map((x) => ({
    name: x[0],
    command: x[1],
  }))
  return scriptList
}

/**
 * scripts that are meant to be ran modularly
 * @returns {string[]} the list of script names
 */
export function getModularScripts(): Script[] {
  let allScripts = getAllScripts()

  // filter by commands
  const commands = allScripts.map((x) => x.command)
  const tsNode = new RegExp('^ts-node ./')
  const filteredCommands = regexMatchOneOf(commands, [tsNode])
  allScripts = allScripts.filter((x) => filteredCommands.includes(x.command))

  // filter by names
  const names = allScripts.map((x) => x.name)
  const blacklist = [
    'dump', // require user interaction
    'restore', // require user interaction
    'pm', // too long
  ]
  const filteredNames = filterList(names, [], blacklist)
  allScripts = allScripts.filter((x) => filteredNames.includes(x.name))

  return allScripts
}

/**
 * scripts that are meant to be ran modularly
 * @returns {string[]} the list of script names
 */
export function getScriptsByRegex(props: {
  nameRegexList?: RegExp[]
  commandRegexList?: RegExp[]
}): Script[] {
  const { nameRegexList, commandRegexList } = props
  let allScripts = getAllScripts()
  // filter by commands
  const commands = allScripts.map((x) => x.command)
  const filteredCommands = regexMatchOneOf(commands, commandRegexList)
  allScripts = allScripts.filter((x) => filteredCommands.includes(x.command))
  // filter by names
  const names = allScripts.map((x) => x.name)
  const filteredNames = regexMatchOneOf(names, nameRegexList)
  return allScripts.filter((x) => filteredNames.includes(x.name))
}
