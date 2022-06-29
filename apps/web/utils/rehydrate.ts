import { addDegreeToCache } from '@/store/cache'
import { setDegree } from '@/store/degree'
import { setGraph } from '@/store/graph'
import store from '@/store/redux'
import { setUser } from '@/store/user'
import { api } from 'api'
import { ModtreeUserContext } from 'types'

const redux = store.getState()
const dispatch = store.dispatch

export function rehydrate(user: ModtreeUserContext['user']) {
  if (redux.user.id === '') {
    api.user
      .getById(user.modtree.id)
      .then((user) => dispatch(setUser(user)))
      .catch(() => false)
  }
  if (redux.degree.id === '') {
    api.degree
      .getById(user.modtree.savedDegrees[0])
      .then((degree) => {
        dispatch(setDegree(degree))
        dispatch(addDegreeToCache(degree))
      })
      .catch(() => false)
  }
  if (redux.graph.id === '') {
    api.graph
      .getById(user.modtree.savedGraphs[0])
      .then((graph) => dispatch(setGraph(graph)))
      .catch(() => false)
  }
}
