describe('Cypress login', () => {
  it('should provide a valid session', () => {
    // Call your custom cypress command
    cy.login2()
    // Visit a route in order to allow cypress to actually set the cookie
    cy.visit('/')
    // Wait until the intercepted request is ready
    cy.wait('@session')
    // This is where you can now add assertions
    // Example: provide a data-test-id on an element.
    // This can be any selector that "always and only" exists when the user is logged in
    cy.get('#modtree-user-circle')
      .should('exist')
      .then(() => {
        cy.log('Cypress login successful')
      })
  })
})
