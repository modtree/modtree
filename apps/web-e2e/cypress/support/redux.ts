import { z } from 'zod'
import type { ReduxState as R } from '../../../web/store/types'

// Indicate that this file is a module
export {}

// for local use only
const uuid = z.string().uuid()

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      reduxGraph(): Chainable<R['graph']>
      reduxDegree(): Chainable<R['modtree']['degree']>
      reduxUser(): Chainable<R['modtree']['user']>
      reduxState(): Chainable<R>
    }
    type ReduxState = R
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
      const parsed = uuid.safeParse(state.graph.id)
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
      const parsed = uuid.safeParse(state.modtree.user.id)
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
      const parsed = uuid.safeParse(state.modtree.degree.id)
      expect(parsed).to.have.nested.include({ success: true })
    })
    .its('modtree.degree')
})

/**
 * waits for the redux state to load
 */
Cypress.Commands.add('reduxState', () => {
  return getState().should((state: R) => {
    const ids = [state.graph.id, state.modtree.user.id, state.modtree.degree.id]
    ids.forEach((id) =>
      // expect this array to be an array of uuids
      expect(uuid.safeParse(id)).to.have.nested.include({ success: true })
    )
  })
})
