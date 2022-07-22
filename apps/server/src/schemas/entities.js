'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
var base_1 = require('./base')
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var entities = {
  User: zod_1.z.object({
    id: base_1['default'].id,
    facebookId: zod_1.z.string(),
    googleId: zod_1.z.string(),
    githubId: zod_1.z.string(),
    displayName: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    matriculationYear: zod_1.z.number(),
    graduationYear: zod_1.z.number(),
    graduationSemester: zod_1.z.number(),
    modulesDone: zod_1.z.array(base_1['default'].id),
    modulesDoing: zod_1.z.array(base_1['default'].id),
    savedDegrees: zod_1.z.array(base_1['default'].id),
    savedGraphs: zod_1.z.array(base_1['default'].id),
    mainDegree: base_1['default'].id,
    mainGraph: base_1['default'].id,
  }),
}
exports['default'] = entities
