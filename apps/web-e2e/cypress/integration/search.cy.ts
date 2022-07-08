describe('search', () => {
  beforeEach(() => cy.visit('http://localhost:3000/'))

  it('should execute a search', () => {
    /**
     * intercept this particular API route and rename it to searchModules
     */
    cy.intercept('GET', '/search/modules/CS1010S').as('searchModules')
    /**
     * type in the search query
     */
    cy.get('[id^=headlessui-combobox-input-]').type('CS1010S')
    /**
     * wait for the last query (the full one) to resolve
     */
    cy.wait('@searchModules')
    /**
     * search for a module
     */
    cy.get('[id^=headlessui-combobox-option]')
      .contains('Programming Methodology')
      .click()
    cy.get('h1').should('have.text', 'CS1010S')
    cy.get('h2').should('have.text', 'Programming Methodology')
    cy.get('#module-modal-close-button').click()
  })
})
