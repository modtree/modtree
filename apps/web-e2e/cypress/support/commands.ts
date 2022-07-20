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
      login2(): void
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

Cypress.Commands.add('login2', () => {
  cy.intercept('/api/auth/session', { fixture: 'session.json' }).as('session')

  // Set the cookie for cypress.
  // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
  // This step can probably/hopefully be improved.
  // We are currently unsure about this part.
  // We need to refresh this cookie once in a while.
  // We are unsure if this is true and if true, when it needs to be refreshed.
  cy.setCookie('next-auth.session-token', Cypress.env('TOKEN'), { log: false })
  Cypress.Cookies.preserveOnce('next-auth.session-token')
})

Cypress.Commands.add('login', () => {
  const username = Cypress.env('GOOGLE_USER')
  const password = Cypress.env('GOOGLE_PW')
  const loginUrl = Cypress.env('SITE_NAME')
  const cookieName = Cypress.env('COOKIE_NAME')
  const socialLoginOptions = {
    username,
    password,
    loginUrl,
    headless: true,
    logs: false,
    isPopup: true,
    loginSelector: `form[action="${Cypress.env('SITE_NAME')}/google"]`,
    postLoginSelector: '#modtree-user-circle',
  }

  cy.visit('/')

  return cy
    .task('GoogleSocialLogin', socialLoginOptions)
    .then(({ cookies }) => {
      cy.clearCookies()

      const cookie = cookies
        .filter((cookie) => cookie.name === cookieName)
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
          preserve: cookieName,
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
