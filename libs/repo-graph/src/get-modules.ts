import { Degree, Module, User } from '@modtree/entity'
import { IModuleRepository, InitGraphProps } from '@modtree/types'

type Result = {
  modulesHidden: Module[]
  modulesPlaced: Module[]
}

/**
 * load the required modules from database, without loading those that
 * are already loaded
 */
async function loadModules(
  moduleRepo: IModuleRepository,
  user: User,
  degree: Degree,
  props: InitGraphProps
): Promise<Module[]> {
  /**
   * array of all loaded modules, to not have to pull again from database
   */
  const alreadyLoaded = degree.modules
  alreadyLoaded.push(...user.modulesDoing)
  alreadyLoaded.push(...user.modulesDone)
  const loadedCodes = alreadyLoaded.map((m) => m.moduleCode)

  /**
   * determine what codes to pull from database
   */
  const codesToFetch = [
    ...props.modulesHiddenCodes,
    ...props.modulesPlacedCodes,
  ].filter((code) => !loadedCodes.includes(code))
  const fetchedModules = moduleRepo.findByCodes(codesToFetch)

  /**
   * combine all required modules into one
   */
  return fetchedModules.then((res) => [...res, ...alreadyLoaded])
}

/**
 * expands a list of module codes to full modules from a cache of modules
 *
 * @param {Set<string>} moduleCodeSet
 * @param {Module[]} cache
 * @returns {Module[]}
 */
function modulify(moduleCodeSet: Set<string>, cache: Module[]): Module[] {
  const codes = Array.from(moduleCodeSet)
  const modules = codes.map((code) => {
    const hit = cache.find((m) => m.moduleCode === code)
    if (!hit) throw new Error('Graph Repository: get modules has faulty cache')
    return hit
  })
  return modules
}

/**
 * gets lists of modules placed and modules hidden
 *
 * @param {User} user
 * @param {Degree} degree
 * @param {InitGraphProps}  props
 * @returns {Promise<[Module[], Module[]]>}
 */
export async function getModules(
  moduleRepo: IModuleRepository,
  user: User,
  degree: Degree,
  props: InitGraphProps
): Promise<Result> {
  const moduleCache = loadModules(moduleRepo, user, degree, props)
  const hiddenSet = new Set(props.modulesHiddenCodes)
  const placedSet = new Set(props.modulesPlacedCodes)

  /**
   * done/doing modules are immediately placed
   */
  user.modulesDoing.forEach((m) => placedSet.add(m.moduleCode))
  user.modulesDone.forEach((m) => placedSet.add(m.moduleCode))

  /**
   * remaining modules in degree are hidden
   */
  degree.modules
    .map((m) => m.moduleCode)
    .forEach((code) => {
      if (!placedSet.has(code)) {
        hiddenSet.add(code)
      }
    })

  /**
   * make codes become modules again
   */
  const result = moduleCache.then((cache) => ({
    modulesHidden: modulify(hiddenSet, cache),
    modulesPlaced: modulify(placedSet, cache),
  }))

  return result
}
