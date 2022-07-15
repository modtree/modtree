import { emptyInit, flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const degree = createRouter()
  /**
   * create and save a degree
   */
  .mutation('create', {
    input: z.object({
      title: z.string().min(1),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    async resolve(req) {
      return api.degreeRepo
        .initialize({ ...emptyInit.Degree, ...req.input })
        .then(flatten.degree)
    },
  })

  /**
   * get a full degree by id
   */
  .query('get-full', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.degreeRepo.findOneById(req.input)
    },
  })

  /**
   * hard-delete a degree
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.degreeRepo.delete(req.input)
    },
  })

  /**
   * modifies a degree
   */
  .mutation('modify', {
    input: z.object({
      id: z.string().uuid(),
      title: z.string().min(1),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    async resolve(req) {
      const { title, moduleCodes, id } = req.input
      return api.degreeRepo
        .findOneById(id)
        .then((degree) => api.degreeRepo.modify(degree, { title, moduleCodes }))
        .then(flatten.degree)
    },
  })