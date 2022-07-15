// these are our presets upon initializing a new user
const modulesDoneCount = 7
const modulesDoingCount = 9

describe('module nodes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.intercept('GET', '/api/auth/login').as('signInToModtree')

    // sign in
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')
  })

  it('all checks', () => {
    // getUser
    cy.intercept('/user/*/get-full').as('getUser')
    cy.wait('@getUser')

    // open modules panel
    cy.get('[id="modtree-user-circle"]').click()
    cy.contains('Your profile').click()
    cy.contains('Modules').click()

    // preset count
    cy.get('[data-cy="done-section"]')
      .children()
      .its('length')
      .should('eq', modulesDoneCount)
    cy.get('[data-cy="doing-section"]')
      .children()
      .its('length')
      .should('eq', modulesDoingCount)
  })
})
