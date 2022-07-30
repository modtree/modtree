describe('login', () => {
  before(() => cy.login())
  it('success', () => cy.getCy('modtree-user-circle').should('exist'))
})
