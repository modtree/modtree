import { TEST_USER, FRONTEND_URL } from '../../utils/constants'

// these are our presets upon initializing a new user
let doneCount = 7
let doingCount = 9

function checkLengths() {
  cy.get('[data-cy="done-section"]')
    .children()
    .its('length')
    .should('eq', doneCount)
  cy.get('[data-cy="doing-section"]')
    .children()
    .its('length')
    .should('eq', doingCount)
}

describe('module nodes', () => {
  /**
   * Login
   */
  before(() => {
    cy.visit(FRONTEND_URL)

    cy.intercept('GET', '/api/auth/login').as('signInToModtree')

    // click the sign in button
    cy.get('a[href="/api/auth/login"]').click()
    cy.wait('@signInToModtree')

    // If redirected away from localhost, then we are at the
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
  })

  beforeEach(() => {
    cy.reload()

    // wait for getUser
    cy.intercept('/trpc/user/*/get-full').as('getUser')
    cy.wait('@getUser')

    // open modules panel
    cy.get('[id="modtree-user-circle"]').then((icon) => {
      icon.click()
      cy.contains('Your profile').click()
      cy.contains('Modules').click()

      // preset count
      checkLengths()
    })
  })

  it('Adds to modules done', () => {
    // add LAC1201 to modules done
    cy.get('[data-cy="modify-done"]').click()
    cy.get('[data-cy="add-done-search"]').type('LAC1201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 1').click()
    cy.get('button').contains('Save changes').click()

    doneCount++
    checkLengths()
  })

  it('Adds to modules doing', () => {
    // add LAC2201 to modules doing
    cy.get('[data-cy="modify-doing"]').click()
    cy.get('[data-cy="add-doing-search"]').type('LAC2201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 2').click()
    cy.get('button').contains('Save changes').click()

    doingCount++
    checkLengths()
  })

  it('Removes from modules done', () => {
    // remove last module from modules done (LAC1201)
    cy.get('[data-cy="modify-done"]').click()
    cy.get('[data-cy="build-list"]').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doneCount--
    checkLengths()
  })

  it('Removes from modules doing', () => {
    // remove last module from modules doing (LAC2201)
    cy.get('[data-cy="modify-doing"]').click()
    cy.get('[data-cy="build-list"]').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doingCount--
    checkLengths()
  })
})
