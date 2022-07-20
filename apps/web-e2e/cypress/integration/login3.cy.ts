describe('Login page', () => {
  before(() => {
    cy.visit('/')
    cy.login3()
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
