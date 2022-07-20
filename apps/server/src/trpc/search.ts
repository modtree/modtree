import { Like } from 'typeorm'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const search = createRouter()
  /**
   * search for modules
   */
  .query('modules', {
    input: z.string(),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo
        .find({
          where: [{ moduleCode: Like(`${input.toUpperCase()}%`) }],
          take: 4,
        })
        .then((r) =>
          Promise.all(r.map((m) => api.moduleRepo.findByCode(m.moduleCode)))
        )
    },
  })

  /**
   * search for modules condensed
   */
  .query('modules-condensed', {
    input: z.string(),
    async resolve({ input }) {
      if (!input) return []
      return api.moduleCondensedRepo.find({
        where: [{ moduleCode: Like(`${input.toUpperCase()}%`) }],
        take: 4,
      })
    },
  })
