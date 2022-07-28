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
      /** general utilities */
      getCy<E>(value: string): Chainable<JQuery<E>>
      findCy<E>(value: string): Chainable<JQuery<E>>

      /** module */
      openModuleModal<E>(
        moduleCode: string,
        title: string
      ): Chainable<JQuery<E>>
      addGraphModule(moduleCode: string, title: string): void
      removeGraphModule(moduleCode: string): void

      /** user profile modal open/close */
      openUserProfile<E>(
        value: 'Degrees' | 'Graphs' | 'Modules'
      ): Chainable<JQuery<E>>
      closeUserProfile<E>(): Chainable<JQuery<E>>

      /** basic graph operations */
      addGraph<E>(title: string): Chainable<JQuery<E>>
      removeGraph<E>(title: string): Chainable<JQuery<E>>
    }
  }
}

/**
 * The return type for this is the same as cy.get().
 * This is a wrapper for cy.get().
 */
Cypress.Commands.add('getCy', (s: string) => cy.get(`[data-cy*="${s}"]`))

/**
 * cy.find() but with data-cy
 * similar idea to getCy
 */
Cypress.Commands.add('findCy', { prevSubject: true }, (s: any, q: string) =>
  s.find(`[data-cy*="${q}"]`)
)

/**
 * opens user profile to the specified page
 *
 * @param {'Degrees' | 'Graphs' | 'Modules'} page
 */
Cypress.Commands.add(
  'openUserProfile',
  (page: 'Degrees' | 'Graphs' | 'Modules') => {
    cy.getCy('modtree-user-circle').click()
    cy.contains('Your profile').click()
    cy.contains(page).click()
    if (page === 'Modules') {
      cy.getCy('done-section')
      cy.getCy('doing-section')
    }
  }
)

/**
 * adds a graph to the user's list of saved graphs
 */
Cypress.Commands.add('addGraph', (title: string) => {
  cy.openUserProfile('Graphs')
  cy.get('button').contains('New graph').click()
  cy.getCy('add-graph-title').clear().type(title)
  cy.get('button').contains('Save graph').click()
  return cy.closeUserProfile()
})

/**
 * removes a graph from the user's list of saved graphs
 */
Cypress.Commands.add('removeGraph', (title: string) => {
  cy.openUserProfile('Graphs')
  cy.get('div')
    .contains(title)
    .parent()
    .within(() => cy.getCy('delete-button').click())
  return cy.closeUserProfile()
})

/**
 * closes the user profile modal
 */
Cypress.Commands.add('closeUserProfile', () => {
  return cy.get('body').click(0, 0)
})

/**
 * opens the module modal to a particular module
 *
 * @param {string} moduleCode
 * @param {string} title
 */
Cypress.Commands.add('openModuleModal', (moduleCode: string, title: string) => {
  cy.getCy('root-search-box')
    .clear()
    .type(moduleCode)
    .getCy('search-result')
    .contains(title)
    .click()
    // wait for modal to load
    .get('h1')
    .contains(moduleCode)
})

Cypress.Commands.add('addGraphModule', (moduleCode: string, title: string) => {
  cy.openModuleModal(moduleCode, title).then(() => {
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
