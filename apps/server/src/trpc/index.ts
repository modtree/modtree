import { createRouter } from './router'
import { user } from './user'
import { graph } from './graph'
import { search } from './search'
import { degree } from './degree'
import { getOne } from './get-one'
import { list } from './list'
import { login } from './login'

export const appRouter = createRouter()
  /** root-level stuff */
  .merge(getOne)
  .merge(list)
  .merge(login)
  /** one-up from root */
  .merge('search/', search)
  .merge('degree/', degree)
  .merge('user/', user)
  .merge('graph/', graph)

export type AppRouter = typeof appRouter
