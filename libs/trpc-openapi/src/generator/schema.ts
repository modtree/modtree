import { TRPCError } from '@trpc/server'
import { OpenAPIV3 } from 'openapi-types'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import {
  instanceofZodType,
  instanceofZodTypeLikeVoid,
  instanceofZodTypeObject,
  instanceofZodTypeOptional,
} from '../utils/zod'

const zodSchemaToOpenApiSchemaObject = (
  zodSchema: z.ZodType,
  path?: string,
  method?: string
): OpenAPIV3.SchemaObject => {
  /**
   * MODTREE WAS HERE
   * if path and method specified, use modtree YAML base path from root
   */
  if (path && method) {
    // NOTE: ~1 is how you represent /
    const statusCode = '200'
    const mimeType = 'application~1json'
    path = path.replace(/\//g, '~1')

    /**
     * full YAML path prefix from root
     * comma separated array, where each element is one nested layer in YAML
     */
    const basePath: string[] = [
      '#',
      'paths',
      path,
      method,
      'responses',
      statusCode,
      'content',
      mimeType,
      'schema',
    ]

    /** use patched base path */
    return zodToJsonSchema(zodSchema, {
      target: 'openApi3',
      basePath,
    })
  } else {
    /** else use trpc-openapi defaults */
    return zodToJsonSchema(zodSchema, { target: 'openApi3' })
  }
}

export const getParameterObjects = (
  schema: unknown,
  pathParameters: string[],
  inType: 'all' | 'path' | 'query',
  /** MODTREE WAS HERE **/
  path: string,
  httpMethod: string
): OpenAPIV3.ParameterObject[] | undefined => {
  if (!instanceofZodType(schema)) {
    throw new TRPCError({
      message: 'Input parser expects a Zod validator',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  if (pathParameters.length === 0 && instanceofZodTypeLikeVoid(schema)) {
    return undefined
  }

  if (!instanceofZodTypeObject(schema)) {
    throw new TRPCError({
      message: 'Input parser must be a ZodObject',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  const shape = schema.shape
  const shapeKeys = Object.keys(shape)

  for (const pathParameter of pathParameters) {
    if (!shapeKeys.includes(pathParameter)) {
      throw new TRPCError({
        message: `Input parser expects key from path: "${pathParameter}"`,
        code: 'INTERNAL_SERVER_ERROR',
      })
    }
  }

  return shapeKeys
    .filter((shapeKey) => {
      const isPathParameter = pathParameters.includes(shapeKey)
      if (inType === 'path') {
        return isPathParameter
      } else if (inType === 'query') {
        return !isPathParameter
      }
      return true
    })
    .map((shapeKey) => {
      let shapeSchema = shape[shapeKey]!
      const isRequired = !shapeSchema.isOptional()
      const isPathParameter = pathParameters.includes(shapeKey)

      // MODTREE WAS HERE
      // if (!instanceofZodTypeLikeString(shapeSchema)) {
      //   throw new TRPCError({
      //     message: `Input parser key: "${shapeKey}" must be ZodString`,
      //     code: 'INTERNAL_SERVER_ERROR',
      //   });
      // }

      if (instanceofZodTypeOptional(shapeSchema)) {
        if (isPathParameter) {
          throw new TRPCError({
            message: `Path parameter: "${shapeKey}" must not be optional`,
            code: 'INTERNAL_SERVER_ERROR',
          })
        }
        shapeSchema = shapeSchema.unwrap()
      }

      const { description, ...schema } = zodSchemaToOpenApiSchemaObject(
        shapeSchema,
        path,
        httpMethod
      )

      return {
        name: shapeKey,
        in: isPathParameter ? 'path' : 'query',
        required: isPathParameter || isRequired,
        schema: schema,
        description: description,
      }
    })
}

export const getRequestBodyObject = (
  schema: unknown,
  pathParameters: string[],
  path: string,
  httpMethod: string
): OpenAPIV3.RequestBodyObject | undefined => {
  if (!instanceofZodType(schema)) {
    throw new TRPCError({
      message: 'Input parser expects a Zod validator',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  if (pathParameters.length === 0 && instanceofZodTypeLikeVoid(schema)) {
    return undefined
  }

  if (!instanceofZodTypeObject(schema)) {
    throw new TRPCError({
      message: 'Input parser must be a ZodObject',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  // remove path parameters
  const mask: Record<string, true> = {}
  pathParameters.forEach((pathParameter) => {
    mask[pathParameter] = true
  })
  const dedupedSchema = schema.omit(mask)

  return {
    required: !schema.isOptional(),
    content: {
      'application/json': {
        schema: zodSchemaToOpenApiSchemaObject(dedupedSchema),
      },
    },
  }
}

export const errorResponseObject = {
  description: 'Error response',
  content: {
    'application/json': {
      schema: zodSchemaToOpenApiSchemaObject(
        z.object({
          ok: z.literal(false),
          error: z.object({
            message: z.string(),
            code: z.string(),
            issues: z.array(z.object({ message: z.string() })).optional(),
          }),
        })
      ),
    },
  },
}

export const getResponsesObject = (
  schema: unknown,
  path: string,
  httpMethod: string
): OpenAPIV3.ResponsesObject => {
  if (!instanceofZodType(schema)) {
    throw new TRPCError({
      message: 'Output parser expects a Zod validator',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  const successResponseObject = {
    description: 'Successful response',
    content: {
      'application/json': {
        schema: zodSchemaToOpenApiSchemaObject(
          z.object({
            ok: z.literal(true),
            data: schema,
          }),
          path,
          httpMethod
        ),
      },
    },
  }

  return {
    200: successResponseObject,
    default: {
      $ref: '#/components/responses/error',
    },
  }
}
