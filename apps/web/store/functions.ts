import { getCSS } from '@/utils/module-state'
import { trpc } from '@/utils/trpc'
import store from '@/store/redux'
import { setNodesAndEdges, setUser } from './modtree'
import { ModuleStatus } from '@modtree/types'
import { setModalModule, showModuleModal } from './modal'
import { addModulesToCache } from './cache'
import { addToBuildList, setBuildList } from './search'

const dispatch = store.dispatch

/**
 * reads user modules dong & doing from redux state
 * reads main graph id from redux state
 * sends and API call to backend for graph's can-takes
 * after calling this function, the frontend graph should be 100% correct.
 */
export function redrawGraph() {
  const { user, graph } = store.getState().modtree
  trpc
    .query('graph/can-take-modules', user.mainGraph)
    .then((canTake) => {
      return getCSS(
        graph.flowNodes,
        user.modulesDone,
        user.modulesDoing,
        canTake
      )
    })
    .then((nodes) => dispatch(setNodesAndEdges(nodes)))
}

/**
 * retrives information about one module and opens the module modal
 */
export function openModuleModal(query: string) {
  trpc
    .query('module-full', query)
    .then((module) => dispatch(setModalModule(module)))
    .then(() => dispatch(showModuleModal()))
}

/**
 * sets some modules to a status
 *
 * @param {ModuleStatus} status
 * @param {string[]} moduleCodes
 */
export function setModuleStatus(status: ModuleStatus, moduleCodes: string[]) {
  if (moduleCodes.length === 0) return
  const { user } = store.getState().modtree
  const existing = {
    [ModuleStatus.DONE]: user.modulesDone,
    [ModuleStatus.DOING]: user.modulesDoing,
    [ModuleStatus.NOT_TAKEN]: [],
  }[status]
  trpc
    .mutation('user/set-module-status', {
      userId: user.id,
      moduleCodes: [...existing, ...moduleCodes],
      status,
    })
    .then((user) => dispatch(setUser(user)))
    .then(() => redrawGraph())
}
/**
 * mark selected nodes with a status,
 * and get the updated user
 *
 * @param {ModuleStatus} status
 */
function markSelectedAs(status: ModuleStatus) {
  const { selectedCodes } = store.getState().modtree.graph
  setModuleStatus(status, selectedCodes)
}

/** for use on flow pane */
export const markAsDone = () => markSelectedAs(ModuleStatus.DONE)
export const markAsDoing = () => markSelectedAs(ModuleStatus.DOING)
export const markAsPlanned = () => markSelectedAs(ModuleStatus.NOT_TAKEN)

/**
 * sends a query to database to update module cache
 *
 * @param {string[]} moduleCodes
 */
export function updateModuleCache(moduleCodes: string[]) {
  const { cache } = store.getState()
  const existingCodes = new Set(Object.keys(cache.modules))

  /** get a list of codes to actually fetch */
  const codesToFetch = moduleCodes.filter((code) => !existingCodes.has(code))
  if (codesToFetch.length === 0) return

  /** send the http request */
  return trpc.query('modules', codesToFetch).then((modules) => {
    /** update the redux store */
    dispatch(addModulesToCache(modules))
  })
}

/**
 * creates and saves a degree, assigning it to the user logged in
 *
 * @param {string} title
 * @param {string[]} moduleCodes
 */
export function createAndSaveDegree(title: string, moduleCodes: string[]) {
  const { user } = store.getState().modtree
  trpc
    .mutation('degree/create', { title, moduleCodes })
    .then((degree) =>
      trpc.mutation('user/insert-degrees', {
        userId: user.id,
        degreeIds: [degree.id],
      })
    )
    .then((user) => dispatch(setUser(user)))
}

/**
 * removes a degree from the user logged in
 *
 * @param {string} degreeId
 */
export function removeDegree(degreeId: string) {
  const { user } = store.getState().modtree
  trpc
    .mutation('user/remove-degree', {
      userId: user.id,
      degreeId,
    })
    .then((user) => setUser(user))
}

/**
 * creates and saves a graph, assigning it to the user logged in
 *
 * @param {string} title
 * @param {string} degreeId
 */
export function createAndSaveGraph(title: string, degreeId: string) {
  const { user } = store.getState().modtree
  trpc
    .mutation('graph/create', { title, userId: user.id, degreeId })
    .then((graph) =>
      trpc.mutation('user/insert-graphs', {
        userId: user.id,
        graphIds: [graph.id],
      })
    )
    .then((user) => dispatch(setUser(user)))
}

/**
 * removes a graph from the user logged in
 *
 * @param {string} graphId
 */
export function removeGraph(graphId: string) {
  const { user } = store.getState().modtree
  trpc
    .mutation('user/remove-graph', {
      userId: user.id,
      graphId,
    })
    .then((user) => dispatch(setUser(user)))
}

/**
 * renames a graph
 *
 * @param {string} graphId
 * @param {string} title
 */
export function renameGraph(graphId: string, title: string) {
  trpc.mutation('graph/rename', { graphId, title })
}

/**
 * loads a degree by id into a degree builder
 * @param {string} degreeId
 */
export function setBuildTarget(degreeId: string) {
  trpc
    .query('degree', degreeId)
    .then((degree) => trpc.query('modules', degree.modules))
    .then((modules) => {
      dispatch(addModulesToCache(modules))
      dispatch(setBuildList(modules.map((m) => m.moduleCode)))
    })
}

/**
 * adds a module to degree builder list by module code
 *
 * @param {string} moduleCode
 */
export function addModuleToBuildList(moduleCode: string) {
  trpc.query('module', moduleCode).then((module) => {
    dispatch(addModulesToCache([module]))
    dispatch(addToBuildList(moduleCode))
  })
}

/**
 * updates a degree in database and retrieves the updated user
 *
 * @param {string} degreeId
 * @param {string} title
 * @param {string[]} moduleCodes
 */
export function updateDegree(
  degreeId: string,
  title: string,
  moduleCodes: string[]
) {
  const { user } = store.getState().modtree
  trpc
    .mutation('degree/update', { degreeId, title, moduleCodes })
    .then(() => trpc.query('user', user.id))
    .then((user) => dispatch(setUser(user)))
}
