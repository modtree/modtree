import {
  createOpenApiExpressMiddleware,
  CreateOpenApiExpressMiddlewareOptions,
  createOpenApiHttpHandler,
  CreateOpenApiHttpHandlerOptions,
  createOpenApiNextHandler,
  CreateOpenApiNextHandlerOptions,
} from './adapters'
import {
  generateOpenApiDocument,
  GenerateOpenApiDocumentOptions,
  openApiVersion,
} from './generator'
import {
  OpenApiErrorResponse,
  OpenApiMeta,
  OpenApiMethod,
  OpenApiResponse,
  OpenApiRouter,
  OpenApiSuccessResponse,
} from './types'
import { ZodTypeLikeString, ZodTypeLikeVoid } from './utils/zod'

export type {
  CreateOpenApiExpressMiddlewareOptions,
  CreateOpenApiNextHandlerOptions,
  CreateOpenApiHttpHandlerOptions,
  GenerateOpenApiDocumentOptions,
  OpenApiRouter,
  OpenApiMeta,
  OpenApiMethod,
  OpenApiResponse,
  OpenApiSuccessResponse,
  OpenApiErrorResponse,
  ZodTypeLikeString,
  ZodTypeLikeVoid,
}

export {
  createOpenApiExpressMiddleware,
  createOpenApiHttpHandler,
  createOpenApiNextHandler,
  openApiVersion,
  generateOpenApiDocument,
}
