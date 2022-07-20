describe('Login page', () => {
  before(() => {
    cy.login()
  })

  it('User is logged in', () => {
    cy.reload()

    cy.get('#modtree-user-circle')
      .should('exist')
      .then(() => {
        cy.log('Cypress login successful')
      })
  })
})
