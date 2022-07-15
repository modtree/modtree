import { router } from '@trpc/server'

/** keep this to be able to inject a custom router/context in the future */
export const createRouter = () => router()
