'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var UUID = '7e2e6a37-7924-4b86-a763-098894213b2f'
var base = {
  id: zod_1.z.string().openapi({
    example: UUID,
  }),
  userId: zod_1.z.string().openapi({
    param: {
      name: 'userId',
      in: 'path',
    },
    example: UUID,
  }),
  degreeId: zod_1.z.string().openapi({
    param: {
      name: 'degreeId',
      in: 'path',
    },
    example: UUID,
  }),
  graphId: zod_1.z.string().openapi({
    param: {
      name: 'graphId',
      in: 'path',
    },
    example: UUID,
  }),
}
exports['default'] = base
