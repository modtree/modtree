import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

const UUID = '7e2e6a37-7924-4b86-a763-098894213b2f'

const base = {
  id: z.string().openapi({
    example: UUID,
  }),
  userId: z.string().openapi({
    param: {
      name: 'userId',
      in: 'path',
    },
    example: UUID,
  }),
  degreeId: z.string().openapi({
    param: {
      name: 'degreeId',
      in: 'path',
    },
    example: UUID,
  }),
  graphId: z.string().openapi({
    param: {
      name: 'graphId',
      in: 'path',
    },
    example: UUID,
  }),
}

export default base
