import { FRONTEND_URL } from '../../utils/constants'

const code = 'MA2104'
const title = 'Multivariable Calculus'

describe('add-and-remove', () => {
  beforeEach(() => {
    cy.visit(FRONTEND_URL)
    cy.login()
  })

  it('all checks', () => {
    /**
     * check that the edges are all correct
     */
    cy.intercept('/user/*/get-full').as('getUser')
    cy.wait('@getUser')
    cy.window()
      .its('store')
      .invoke('getState')
      .its('graph.flowEdges')
      .should('deep.equal', [
        { id: 'MA2002-MA2219', source: 'MA2002', target: 'MA2219' },
        { id: 'MA1100-MA2219', source: 'MA1100', target: 'MA2219' },
        { id: 'MA2001-MA2219', source: 'MA2001', target: 'MA2219' },
        { id: 'MA2001-MA2101', source: 'MA2001', target: 'MA2101' },
        { id: 'MA2101-MA3201', source: 'MA2101', target: 'MA3201' },
      ])
  })

  it('adds a module', () => {
    cy.addGraphModule(code, title)
  })

  it('cannot add the same module', () => {
    cy.get('[data-cy=root-search-box]')
      .clear()
      .type(code)
      .then(() => {
        cy.get('[data-cy=search-result]').contains(title).click()
      })
      .then(() => {
        // Should not have add to graph button
        cy.get('[data-cy=module-modal]')
          .contains('Add to graph')
          .should('not.exist')

        // Close modal
        cy.get('[data-cy=module-modal-close-button]').click()
      })
  })

  it('removes a module', () => {
    cy.removeGraphModule(code)
  })

  it('can now add the same module', () => {
    cy.get('[data-cy=root-search-box]')
      .clear()
      .type(code)
      .then(() => {
        cy.get('[data-cy=search-result]').contains(title).click()
      })
      .then(() => {
        // Should have add to graph button
        cy.get('[data-cy=module-modal]')
          .contains('Add to graph')
          .should('be.visible')

        // Close modal
        cy.get('[data-cy=module-modal-close-button]').click()
      })
  })
})
