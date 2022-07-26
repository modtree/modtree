import { createRouter } from './router'
import { user } from './user'
import { graph } from './graph'
import { search } from './search'
import { degree } from './degree'
import { getOne } from './get-one'
import { list } from './list'

export const appRouter = createRouter()
  /** root-level stuff */
  .merge(getOne)
  .merge(list)
  /** one-up from root */
  .merge('search/', search)
  .merge('degree/', degree)
  .merge('user/', user)
  .merge('graph/', graph)

/** because tRPC routes need to be mounted at /trpc */
export const trpcReactRouter = createRouter()
  /** root-level stuff */
  .merge('trpc/', getOne)
  .merge('trpc/', list)
  /** one-up from root */
  .merge('trpc/search/', search)
  .merge('trpc/degree/', degree)
  .merge('trpc/user/', user)
  .merge('tprc/graph/', graph)

export type AppRouter = typeof appRouter
export type trpcReactRouter = typeof trpcReactRouter
