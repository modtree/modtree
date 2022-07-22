import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import base from './base'

extendZodWithOpenApi(z)

const entities = {
  User: z.object({
    id: base.id,
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: z.string().email(),
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: z.array(base.id),
    modulesDoing: z.array(base.id),
    savedDegrees: z.array(base.id),
    savedGraphs: z.array(base.id),
    mainDegree: base.id,
    mainGraph: base.id,
  }),
}

export default entities
