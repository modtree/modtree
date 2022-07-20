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
  const username = Cypress.env('GOOGLE_USER')
  const password = Cypress.env('GOOGLE_PW')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const SECURE_COOKIE_NAME = Cypress.env('SECURE_COOKIE_NAME')

  const BASE_URL = Cypress.config('baseUrl')
  // Login page URL
  const loginUrl = BASE_URL + '/api/auth/signin'
  // The selector for Google on our login page
  const loginSelector = `form[action="${BASE_URL}/api/auth/signin/google"]`

  const socialLoginOptions = {
    username,
    password,
    loginUrl,
    headless: true,
    logs: false,
    isPopup: true,
    loginSelector,
    postLoginSelector: '#modtree-user-circle',
  }

  cy.visit('/')

  return cy
    .task('GoogleSocialLogin', socialLoginOptions)
    .then(({ cookies }) => {
      cy.clearCookies()

      const cookie = cookies
        .filter(
          (cookie) =>
            cookie.name === COOKIE_NAME || cookie.name === SECURE_COOKIE_NAME
        )
        .pop()
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        })

        Cypress.Cookies.defaults({
          preserve: [COOKIE_NAME, SECURE_COOKIE_NAME],
        })
      }
    })
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
