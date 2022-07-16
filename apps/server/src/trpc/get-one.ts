import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'

export const getOne = createRouter()
  /** get a module by id */
  .query('module', {
    input: z.string().regex(validModuleRegex),
    async resolve(req) {
      return api.moduleRepo.findByCode(req.input)
    },
  })

  /** get a condensed module by id */
  .query('module-condensed', {
    input: z.string().regex(validModuleRegex),
    async resolve(req) {
      return api.moduleCondensedRepo.findByCode(req.input)
    },
  })

  /** get a full module by id */
  .query('module-full', {
    input: z.string().regex(validModuleRegex),
    async resolve(req) {
      return api.moduleFullRepo.findByCode(req.input)
    },
  })

  /** get a degree by id */
  .query('degree', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.degreeRepo.findOneById(req.input).then(flatten.degree)
    },
  })

  /** get a user by id */
  .query('user', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo.findOneById(req.input).then(flatten.user)
    },
  })

  /** get a graph by id */
  .query('graph', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.graphRepo.findOneById(req.input).then(flatten.graph)
    },
  })
