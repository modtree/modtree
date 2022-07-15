import { createReactQueryHooks, createTRPCClient } from '@trpc/react'
import type { AppRouter } from '@modtree/server'

export const trpc = createReactQueryHooks<AppRouter>()
// => { useQuery: ..., useMutation: ...}

export const trpcClient = createTRPCClient<AppRouter>({
  url: 'http://localhost:8080/trpc',
})
