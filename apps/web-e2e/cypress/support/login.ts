// Indicate that this file is a module
export {}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      login(props?: { reset?: boolean }): void
      loginCred(): void
      loginSocial(): void
    }
  }
}

/**
 * logs the user in.
 * meant to be used in the before() call
 */
Cypress.Commands.add('login', (props?: { reset?: boolean }) => {
  const isLocal = Cypress.config('baseUrl').includes('localhost')
  if (isLocal) {
    cy.loginCred()
  } else {
    cy.loginSocial()
  }
  if (props && props.reset) {
    cy.resetUser()
  }
})

/**
 * Primary login method for local testing.
 */
Cypress.Commands.add('loginCred', () => {
  cy.intercept(/api\/auth\/session/).as('session')
  // on the home page, click on the sign in button
  cy.visit('/')
  cy.getCy('sign-in-button').click()

  // click on the password-less test user sign in
  cy.contains('Sign in with Credentials').click()

  // wait for login to complete
  cy.wait('@session')
  cy.reduxState()
})

/**
 * Slower, unstable login. But can be used to test dev/prod envs.
 */
Cypress.Commands.add('loginSocial', () => {
  const username = Cypress.env('GITHUB_USER')
  const password = Cypress.env('GITHUB_PW')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const SECURE_COOKIE_NAME = Cypress.env('SECURE_COOKIE_NAME')
  const BASE_URL = Cypress.config('baseUrl')
  // Login page URL
  const loginUrl = BASE_URL + '/api/auth/signin'
  // The selector for Google on our login page
  const loginSelector = `form[action="${BASE_URL}/api/auth/signin/github"]`
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
    .task('GitHubSocialLogin', socialLoginOptions)
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
