import { getCSS } from '@/utils/module-state'
import { trpc } from '@/utils/trpc'
import store, { r } from '@/store/redux'
import { ApiResponse, GraphFlowNode, ModuleStatus } from '@modtree/types'

const dispatch = store.dispatch

/**
 * reads user modules dong & doing from redux state
 * reads main graph id from redux state
 * sends and API call to backend for graph's can-takes
 * after calling this function, the frontend graph should be 100% correct.
 */
export function redrawGraph() {
  const {
    modtree: { user },
    graph,
  } = store.getState()
  trpc
    .mutation('graph/update', { graphId: graph.id, graph })
    .then((res) => {
      return getCSS(
        graph.flowNodes,
        user.modulesDone,
        user.modulesDoing,
        res.canTakes
      )
    })
    .then((nodes) => dispatch(r.setNodesAndEdges(nodes)))
}

/**
 * retrives information about one module and opens the module modal
 */
export function openModuleModal(query: string) {
  trpc
    .query('module-full', { moduleCode: query })
    .then((module) => dispatch(r.setModalModule(module)))
    .then(() => dispatch(r.showModuleModal()))
}

/**
 * sets some modules to a status
 *
 * @param {ModuleStatus} status
 * @param {string[]} moduleCodes
 */
export function setModuleStatus(status: ModuleStatus, moduleCodes: string[]) {
  const { user } = store.getState().modtree
  trpc
    .mutation('user/set-module-status', {
      userId: user.id,
      moduleCodes,
      status,
    })
    .then((user) => dispatch(r.setUser(user)))
    .then(() => redrawGraph())
}

/**
 * mark selected nodes with a status,
 * and get the updated user
 *
 * @param {ModuleStatus} status
 */
function markSelectedAs(status: ModuleStatus) {
  const {
    graph,
    modtree: { user },
  } = store.getState()
  const selectedCodes = graph.flowNodes
    .filter((n) => n.selected)
    .map((n) => n.data.moduleCode)

  const existing = {
    [ModuleStatus.DONE]: user.modulesDone,
    [ModuleStatus.DOING]: user.modulesDoing,
    [ModuleStatus.NOT_TAKEN]: [],
  }[status]

  setModuleStatus(status, [...existing, ...selectedCodes])
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
  return trpc
    .query('modules', { moduleCodes: codesToFetch })
    .then((modules) => {
      /** update the redux store */
      dispatch(r.addModulesToCache(modules))
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
    .then((user) => dispatch(r.setUser(user)))
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
    .then((user) => dispatch(r.setUser(user)))
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
    .then((user) => dispatch(r.setUser(user)))
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
    .then((user) => dispatch(r.setUser(user)))
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
    .query('degree', { degreeId })
    .then((degree) => trpc.query('modules', { moduleCodes: degree.modules }))
    .then((modules) => {
      dispatch(r.addModulesToCache(modules))
      dispatch(r.setBuildList(modules.map((m) => m.moduleCode)))
    })
}

/**
 * adds a module to degree builder list by module code
 *
 * @param {string} moduleCode
 */
export function addModuleToBuildList(moduleCode: string) {
  trpc.query('module', { moduleCode }).then((module) => {
    dispatch(r.addModulesToCache([module]))
    dispatch(r.addToBuildList(moduleCode))
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
    .then(() => trpc.query('user', { userId: user.id }))
    .then((user) => dispatch(r.setUser(user)))
}

export function setMainDegree(degree: ApiResponse.Degree) {
  const { user } = store.getState().modtree
  trpc.mutation('user/set-main-degree', {
    userId: user.id,
    degreeId: degree.id,
  })
  dispatch(r.setMainDegree(degree))
}

export function addModuleNode(node: GraphFlowNode) {
  if (!node) return
  const graph = store.getState().graph

  /** if the id is already in, do nothing. */
  if (!graph.flowNodes.every((n) => n.id !== node.id)) return

  /** add it to the graph */
  dispatch(r.setNodes([...graph.flowNodes, node]))
  redrawGraph()
}

export function removeModuleNode(node: GraphFlowNode) {
  if (!node) return
  const graph = store.getState().graph

  const newNodes = graph.flowNodes.filter((n) => n.id !== node.id)
  if (newNodes.length === graph.flowNodes.length) return

  /** add it to the graph */
  dispatch(r.setNodes(newNodes))
  redrawGraph()
}

export function resetUser() {
  const userId = store.getState().modtree.user.id
  trpc.mutation('user/reset', userId)
}
