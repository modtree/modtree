import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { validModuleRegex } from '@modtree/utils'
import { z } from 'zod'

extendZodWithOpenApi(z)

const UUID = '7e2e6a37-7924-4b86-a763-098894213b2f'

const moduleCode = z.string().regex(validModuleRegex)

const base = {
  id: z.string().openapi({
    example: UUID,
  }),
  email: z.string().openapi({
    example: 'user@gmail.com',
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
  moduleCode: moduleCode.openapi({
    example: 'CS1010S',
  }),
  moduleArray: z.array(moduleCode).openapi({
    example: ['MA2001', 'MA2002'],
  }),
}

export default base
