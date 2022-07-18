import { FRONTEND_URL } from '../../utils/constants'

// these are our presets upon initializing a new user
let doneCount = 7
let doingCount = 9

function checkLengths() {
  cy.getCy('done-section').children().its('length').should('eq', doneCount)
  cy.getCy('doing-section').children().its('length').should('eq', doingCount)
}

describe('modules panel', () => {
  /**
   * Login
   */
  beforeEach(() => {
    cy.visit(FRONTEND_URL)
    cy.login()

    // open modules panel
    cy.get('[id="modtree-user-circle"]').then((icon) => {
      icon.click()
      cy.contains('Your profile').click()
      cy.contains('Modules').click()
    })
  })

  it('Initial counts', () => {
    checkLengths()
  })

  it('Adds to modules done', () => {
    // add LAC1201 to modules done
    cy.getCy('modify-done').click()
    cy.getCy('add-done-search').type('LAC1201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 1').click()
    // wait for module to be in list
    cy.getCy('build-list').contains('Chinese 1')
    cy.get('button').contains('Save changes').click()

    doneCount++
    checkLengths()
  })

  it('Adds to modules doing', () => {
    // add LAC2201 to modules doing
    cy.getCy('modify-doing').click()
    cy.getCy('add-doing-search').type('LAC2201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 2').click()
    // wait for module to be in list
    cy.getCy('build-list').contains('Chinese 2')
    cy.get('button').contains('Save changes').click()

    doingCount++
    checkLengths()
  })

  it('Removes from modules done', () => {
    // remove last module from modules done (LAC1201)
    cy.getCy('modify-done').click()
    cy.getCy('build-list').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doneCount--
    checkLengths()
  })

  it('Removes from modules doing', () => {
    // remove last module from modules doing (LAC2201)
    cy.getCy('modify-doing').click()
    cy.getCy('build-list').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div').last().find('button').click()
    cy.get('button').contains('Save changes').click()

    doingCount--
    checkLengths()
  })
})
