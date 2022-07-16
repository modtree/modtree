describe('search', () => {
  beforeEach(() => cy.visit('http://localhost:3000/'))

  it('should execute a search', () => {
    // intercept this particular API route and rename it to searchModules
    cy.intercept('GET', '/trpc/search/modules').as('searchModules')

    // type in the search query
    cy.get('[data-cy=root-search-box]')
      .type('CS1010S')
      .then(() => {
        cy.get('[data-cy=search-result]')
          .contains('Programming Methodology')
          .click()
        cy.get('h1').should('have.text', 'CS1010S')
        cy.get('h2').should('have.text', 'Programming Methodology')
        cy.get('#module-modal-close-button').click()
      })
  })
})
