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
  const authZeroLoaded = user.modtreeId !== ''
  const reduxLoaded = redux.user.id !== ''
  if (reduxLoaded) {
    return redux.user
  } else if (authZeroLoaded) {
    return api.user
      .getById(user.modtreeId)
      .then((user) => {
        dispatch(setUser(user))
        return user
      })
      .catch(() => empty.UserFull)
  } else {
    return empty.UserFull
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
      const graphId = user.mainGraph
      if (!graphId) return
      api.graph.getById(graphId).then((g) => {
        dispatch(setGraph(g))
      })
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
