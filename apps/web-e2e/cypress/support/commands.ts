// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Indicate that this file is a module
export {}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      login(): void
      loadModuleModal<E>(
        moduleCode: string,
        title: string
      ): Chainable<JQuery<E>>
      addGraphModule(moduleCode: string, title: string): void
      removeGraphModule(moduleCode: string): void
      /*
       * The return type for this is the same as cy.get().
       * This is a wrapper for cy.get().
       */
      getCy<E>(value: string): Chainable<JQuery<E>>
    }
  }
}

Cypress.Commands.add('getCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('login', () => {
  cy.visit('/')
  cy.getCy('sign-in-button').click()
  cy.contains('Sign in with Credentials').click()

  // wait for login to complete
  cy.getCy('modtree-user-circle')
})

Cypress.Commands.add('loadModuleModal', (moduleCode: string, title: string) => {
  return cy
    .getCy('root-search-box')
    .clear()
    .type(moduleCode)
    .then(() => {
      cy.getCy('search-result').contains(title).click()
      // wait for modal to load
      cy.get('h1').contains(moduleCode)
    })
})

Cypress.Commands.add('addGraphModule', (moduleCode: string, title: string) => {
  cy.loadModuleModal(moduleCode, title).then(() => {
    cy.get('button').contains('Add to graph').click()
    cy.getCy(`node-${moduleCode}`)
  })
})

Cypress.Commands.add('removeGraphModule', (moduleCode: string) => {
  cy.getCy(`node-${moduleCode}`)
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
