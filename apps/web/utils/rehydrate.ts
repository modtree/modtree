import { setMainGraph, setMainDegree } from '@/store/modtree'
import store from '@/store/redux'
import { setUser } from '@/store/modtree'
import { Session } from 'next-auth'
import { trpc } from './trpc'

const dispatch = store.dispatch

/**
 * Loads main degree/graph into store, if not yet loaded.
 */
export function rehydrate(user: Session['user']) {
  if (!user.modtreeId) {
    console.debug('User id empty. Rehydrate failed.')
  }

  /** rehydrate user */
  const rUser = trpc.query('user', user.modtreeId).then((user) => {
    dispatch(setUser(user))
    return user
  })

  /** rehydrate degree */
  const rDegree = rUser
    .then((user) => trpc.query('degree', user.mainDegree))
    .then((degree) => {
      dispatch(setMainDegree(degree))
    })

  /** rehydrate graph */
  const rGraph = rUser
    .then((user) => trpc.query('graph', user.mainGraph))
    .then((graph) => {
      dispatch(setMainGraph(graph))
    })

  /** reporting */
  Promise.all([rUser, rDegree, rGraph])
    .then(() => {
      console.debug('Successfully rehydrated user, degree, graph.')
    })
    .catch(() => {
      console.debug('Failed to rehydrate user, degree, graph.')
    })
}

/**
 * Fetch and update user with latest data.
 */
export async function updateUser() {
  const userId = store.getState().modtree.user.id
  return trpc.query('user', userId).then((user) => {
    dispatch(setUser(user))
    return user
  })
}
