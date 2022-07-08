describe('authentication', () => {
  beforeEach(() => cy.visit('http://localhost:3000/'))

  it('sign in and sign out', () => {
    /** intercepts */
    cy.intercept('GET', '/api/auth/login').as('signInToModtree')
    cy.intercept('GET', '/api/auth/callback').as('authZeroCallback')

    /** just logout every time */
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')
    cy.visit('/api/auth/logout')

    /**
     * execute the real test
     */
    // click the sign in button
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')
    // key in credentials
    cy.get('[id="username"]').type('test@user.com')
    cy.get('[id="password"]').type('Test@1234')
    cy.get('button[type="submit"]').click()
    // reload because cypress and auth0 callbacks don't play nice
    cy.reload()
    // sign out
    cy.get('[id="modtree-user-circle"]').click()
    cy.get('a[href="/api/auth/logout"]').click()
    // ensure that sign out is successful
    cy.get('a[href="/api/auth/login"]').should('have.text', 'Sign in')
  })
})
