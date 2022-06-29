import { setDegree } from '@/store/degree'
import { setGraph } from '@/store/graph'
import store from '@/store/redux'
import { setUser } from '@/store/user'
import { ModtreeUserContext } from 'types'
import { backend } from './backend'

const redux = store.getState()
const dispatch = store.dispatch

export function rehydrate(user: ModtreeUserContext['user']) {
  if (redux.user.id === '') {
    backend
      .get(`/user/${user.modtree.id}`)
      .then((res) => dispatch(setUser(res.data)))
  }
  if (redux.degree.id === '') {
    backend.get(`/degree/${user.modtree.savedDegrees[0]}`).then((res) => {
      dispatch(setDegree(res.data))
    })
  }
  if (redux.graph.id === '') {
    backend
      .get(`/graph/${user.modtree.savedGraphs[0]}`)
      .then((res) => dispatch(setGraph(res.data)))
  }
}
