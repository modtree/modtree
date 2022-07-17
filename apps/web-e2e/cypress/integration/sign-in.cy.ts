import { FRONTEND_URL, TEST_USER } from '../utils/constants'

describe('authentication', () => {
  beforeEach(() => cy.visit(FRONTEND_URL))

  it('sign in and sign out', () => {
    /** intercepts */
    cy.intercept('GET', '/api/auth/login').as('signInToModtree')
    cy.intercept('GET', '/api/auth/callback').as('authZeroCallback')

    /** just logout every time */
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')
    cy.visit(FRONTEND_URL + '/api/auth/logout')

    /**
     * execute the real test
     */
    // click the sign in button
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')
    // key in credentials
    cy.get('[id="username"]').type(TEST_USER.email)
    cy.get('[id="password"]').type(TEST_USER.password)
    cy.get('button[type="submit"]').click()
    // reload because cypress and auth0 callbacks don't play nice
    cy.reload()
    // sign out
    cy.get('[id="modtree-user-circle"]').click()
    cy.get('[data-cy="email"]').should('have.text', TEST_USER.email)
    cy.get('a[href="/api/auth/logout"]').click()
    // ensure that sign out is successful
    cy.get('a[href="/api/auth/login"]').should('have.text', 'Sign in')
  })
})
