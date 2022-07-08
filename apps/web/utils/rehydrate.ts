import { setDegree } from '@/store/degree'
import { setGraph } from '@/store/graph'
import store from '@/store/redux'
import { setUser } from '@/store/user'
import { ModtreeApiResponse } from '@modtree/types'
import { empty } from '@modtree/utils'
import { api } from 'api'
import { ModtreeUserProfile } from 'types'

const redux = store.getState()
const dispatch = store.dispatch

async function getUser(
  user: ModtreeUserProfile
): Promise<ModtreeApiResponse.UserFull> {
  if (redux.user.id === '') {
    return api.user
      .getById(user.modtreeId)
      .then((user) => {
        dispatch(setUser(user))
        return user
      })
      .catch(() => empty.UserFull)
  } else {
    return redux.user
  }
}

/**
 * Loads main degree/graph into store, if not yet loaded.
 */
export function rehydrate(user: ModtreeUserProfile) {
  const userPromise = getUser(user)
  userPromise.then((user) => {
    if (redux.degree.id === '') {
      const degree = user.mainDegree
      if (!degree) return
      dispatch(setDegree(degree))
    }
    if (redux.graph.id === '') {
      const graph = user.mainGraph
      if (!graph) return
      dispatch(setGraph(graph))
    }
  })
}

/**
 * Fetch and update user with latest data.
 */
export async function updateUser() {
  const userId = store.getState().user.id
  return api.user.getById(userId).then((user) => {
    dispatch(setUser(user))
    return user
  })
}
