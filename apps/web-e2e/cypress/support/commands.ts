// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { TEST_USER } from '../utils/constants'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      login(): void
      addGraphModule(moduleCode: string, title: string): void
      removeGraphModule(moduleCode: string): void
    }
  }
}

/**
 * Click sign in button, and fill in Auth0 details if necessary.
 */
Cypress.Commands.add('login', () => {
  cy.intercept('GET', '/api/auth/login').as('signInToModtree')

  // 1. click the sign in button
  cy.get('a[href="/api/auth/login"]').click()
  cy.wait('@signInToModtree')

  // 2. If redirected away from localhost, then we are at the
  // Auth0 login page. Then sign in with test user.
  //
  // Else, login data was saved from a previous session, so proceed.
  cy.url().then((URL) => {
    if (!URL.includes('localhost')) {
      // key in credentials
      cy.get('[id="username"]').type(TEST_USER.email)
      cy.get('[id="password"]').type(TEST_USER.password)
      cy.get('button[type="submit"]').click()

      // reload because cypress and auth0 callbacks don't play nice
      cy.reload()
    }
  })

  // 3. wait for user to load
  cy.wait(2000)
  /**
   * Correct alternative getUser is unstable
   */
  // cy.intercept('/trpc/user/get-full**').as('getUser')
  // cy.wait('@getUser')
})

Cypress.Commands.add('addGraphModule', (moduleCode: string, title: string) => {
  cy.get('[data-cy=root-search-box]')
    .clear()
    .type(moduleCode)
    .then(() => {
      cy.get('[data-cy=search-result]').contains(title).click()
    })
    .then(() => {
      cy.get('button').contains('Add to graph').click()
      /**
       * wait for module to be added to graph
       */
      cy.wait(3000)
    })
})

Cypress.Commands.add('removeGraphModule', (moduleCode: string) => {
  cy.get(`[data-cy=node-${moduleCode}]`)
    .rightclick()
    .then(() => {
      // force a click, because sometimes the node is outside
      // of the screen and cypress checks for that
      cy.get('[data-cy=context-menu-item] > div > a')
        .contains('Remove')
        .click({ force: true })
    })
})

//
// -- This is a parent command --
//Cypress.Commands.add('login', (email, password) => {
// console.debug('Custom command example: Login', email, password)
//})
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
