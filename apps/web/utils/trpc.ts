import { createReactQueryHooks, createTRPCClient } from '@trpc/react'
import type { AppRouter } from '@modtree/server'

export const trpcReact = createReactQueryHooks<AppRouter>()
// => { useQuery: ..., useMutation: ...}

const envUrl = process.env.NEXT_PUBLIC_BACKEND

export const trpcClientUrl = envUrl ? envUrl : 'http://localhost:8080/trpc'

export const trpc = createTRPCClient<AppRouter>({
  url: trpcClientUrl,
})
