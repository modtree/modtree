describe('search', () => {
  beforeEach(() => cy.visit('/'))

  it('should execute a search', () => {
    // type in the search query
    cy.getCy('root-search-box')
      .type('CS1010S')
      .then(() => {
        cy.getCy('search-result').contains('Programming Methodology').click()
        cy.get('h1').should('have.text', 'CS1010S')
        cy.get('h2').should('have.text', 'Programming Methodology')
        cy.getCy('module-modal-close-button').click()
      })
  })
})
