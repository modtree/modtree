import { router } from '@trpc/server'
import { OpenApiMeta } from 'trpc-openapi'

/** keep this to be able to inject a custom router/context in the future */
export const createRouter = () => router<any, OpenApiMeta>()
