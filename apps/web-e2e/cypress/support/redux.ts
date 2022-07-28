import { z } from 'zod'
import type { ReduxState } from '../../../web/store/types'

// Indicate that this file is a module
export {}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      reduxGraph(): Chainable<ReduxState['graph']>
      reduxDegree(): Chainable<ReduxState['modtree']['degree']>
      reduxUser(): Chainable<ReduxState['modtree']['user']>
    }
  }
}

/** for use in this file only */
const getState = () => cy.window().its('store').invoke('getState')

/**
 * waits for the redux graph state to load, then returns it
 */
Cypress.Commands.add('reduxGraph', () => {
  return getState()
    .should((state) => {
      /** wait for graph id to become a valid uuid */
      const parsed = z.string().uuid().safeParse(state.graph.id)
      expect(parsed).to.have.nested.include({ success: true })
    })
    .its('graph')
})

/**
 * waits for the redux user state to load, then returns it
 */
Cypress.Commands.add('reduxUser', () => {
  return getState()
    .should((state) => {
      /** wait for graph id to become a valid uuid */
      const parsed = z.string().uuid().safeParse(state.modtree.user.id)
      expect(parsed).to.have.nested.include({ success: true })
    })
    .its('modtree.user')
})

/**
 * waits for the redux degree state to load, then returns it
 */
Cypress.Commands.add('reduxDegree', () => {
  return getState()
    .should((state) => {
      /** wait for graph id to become a valid uuid */
      const parsed = z.string().uuid().safeParse(state.modtree.degree.id)
      expect(parsed).to.have.nested.include({ success: true })
    })
    .its('modtree.degree')
})
