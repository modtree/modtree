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
    checkLengths()

    // add LAC1201 to modules done
    cy.get('[data-cy="modify-done"]').click()
    cy.get('[data-cy="add-done-search"]').type('LAC1201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 1').click()
    cy.get('button').contains('Save changes').click()

    doneCount++
    checkLengths()

    // add LAC2201 to modules doing
    cy.get('[data-cy="modify-doing"]').click()
    cy.get('[data-cy="add-doing-search"]').type('LAC2201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 2').click()
    cy.get('button').contains('Save changes').click()

    doingCount++
    checkLengths()

    // remove last module from modules done (LAC1201)
    cy.get('[data-cy="modify-done"]').click()
    cy.get('[data-cy="build-list"]').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doneCount--
    checkLengths()

    // remove last module from modules doing (LAC2201)
    cy.get('[data-cy="modify-doing"]').click()
    cy.get('[data-cy="build-list"]').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doingCount--
    checkLengths()

    // refresh page and the above should be persisted
  })
})
