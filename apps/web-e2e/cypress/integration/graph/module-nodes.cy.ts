import { FRONTEND_URL } from '../../utils/constants'

describe('module nodes', () => {
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
    /**
     * search for MA2104 and add it to graph
     */
    cy.intercept('GET', '/search/modules/MA2104').as('searchMA2104')
    cy.get('[id^=headlessui-combobox-input-]').type('MA2104')
    cy.wait('@searchMA2104')
    cy.get('[id^=headlessui-combobox-option]')
      .contains('Multivariable Calculus')
      .click()
    cy.get('button').contains('Add to graph').click()

    /**
     * search for MA3220 and add it to graph
     */
    cy.intercept('GET', '/search/modules/MA3220').as('searchMA3220')
    cy.get('[id^=headlessui-combobox-input-]').clear().type('MA3220')
    cy.wait('@searchMA3220')
    cy.get('[id^=headlessui-combobox-option]')
      .contains('Ordinary Differential Equations')
      .click()
    cy.get('button').contains('Add to graph').click()

    /**
     * search for MA4221 and add it to graph
     */
    cy.intercept('GET', '/search/modules/MA4221').as('searchMA4221')
    cy.get('[id^=headlessui-combobox-input-]').clear().type('MA4221')
    cy.wait('@searchMA4221')
    cy.get('[id^=headlessui-combobox-option]')
      .contains('Partial Differential Equations')
      .click()
    cy.get('button').contains('Add to graph').click()
  })
})
