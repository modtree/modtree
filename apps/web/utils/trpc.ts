import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from '@modtree/server'

export const trpc = createReactQueryHooks<AppRouter>()
// => { useQuery: ..., useMutation: ...}
