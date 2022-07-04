import { Degree, Module, User } from '@modtree/entity'
import { IModuleRepository, InitGraphProps } from '@modtree/types'
import { emptyInit } from '@modtree/utils'

type Result = {
  modulesHidden: Module[]
  modulesPlaced: Module[]
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
  /**
   * array of all loaded modules, to not have to pull again from database
   */
  const loadedModules = degree.modules
  loadedModules.push(...user.modulesDoing)
  loadedModules.push(...user.modulesDone)
  const loadedCodes = loadedModules.map((m) => m.moduleCode)

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
  const moduleCache = fetchedModules.then((res) => [...res, ...loadedModules])

  /**
   * determine what codes go where
   */
  const codes = {
    hidden: new Set(props.modulesHiddenCodes),
    placed: new Set(props.modulesPlacedCodes),
    degree: degree.modules.map((m) => m.moduleCode),
    doing: user.modulesDoing.map((m) => m.moduleCode),
    done: user.modulesDone.map((m) => m.moduleCode),
  }

  /**
   * done/doing modules are immediately placed
   */
  user.modulesDoing.forEach((m) => codes.placed.add(m.moduleCode))
  user.modulesDone.forEach((m) => codes.placed.add(m.moduleCode))

  /**
   * remaining modules in degree are hidden
   */
  degree.modules
    .map((m) => m.moduleCode)
    .forEach((code) => {
      if (!codes.placed.has(code)) {
        codes.hidden.add(code)
      }
    })

  const empty = moduleRepo.create(emptyInit.Module)

  const result = moduleCache.then((cache) => ({
    modulesHidden: Array.from(codes.hidden).map(
      (code) => cache.find((m) => m.moduleCode === code) || empty
    ),
    modulesPlaced: Array.from(codes.placed).map(
      (code) => cache.find((m) => m.moduleCode === code) || empty
    ),
  }))

  return result
}
