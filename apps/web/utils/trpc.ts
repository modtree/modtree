import { createReactQueryHooks, createTRPCClient } from '@trpc/react'
import type { AppRouter } from '@modtree/server'

export const trpcReact = createReactQueryHooks<AppRouter>()
// => { useQuery: ..., useMutation: ...}

export const trpc = createTRPCClient<AppRouter>({
  url: 'http://localhost:8080/trpc',
})
