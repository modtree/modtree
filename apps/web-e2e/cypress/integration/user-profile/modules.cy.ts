/**
 * Checks for correct number of modules
 */
function checkLengths(done: number, doing: number) {
  cy.getCy('done-section').children('div').should('have.length', done)
  cy.getCy('doing-section').children('div').should('have.length', doing)
}

function waitForLoad() {
  cy.getCy('done-section')
  cy.getCy('doing-section')
}

function deleteModuleFromSettings(moduleCode: string) {
  return cy
    .getCy('build-list')
    .contains(moduleCode)
    .parent()
    .parent()
    .findCy('delete-button')
    .click()
}

describe('modules panel', () => {
  beforeEach(() => {
    cy.login()
    cy.reduxUser()

    // open modules panel
    cy.openUserProfile('Modules')
  })

  it('User has no done/doing modules', () => {
    cy.getCy('done-module').should('not.exist')
    cy.getCy('doing-module').should('not.exist')
  })

  it('Adds LAC1201 to modules done', () => {
    // Wait for modules to load
    cy.getCy('modify-done').click()

    // Insert LAC1201
    cy.getCy('add-done-search').type('LAC1201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 1').click()

    // Wait for module to be in list
    cy.getCy('build-list').contains('Chinese 1')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    checkLengths(1, 0)
  })

  it('Adds LAC2201 to modules doing', () => {
    // Wait for modules to load
    cy.getCy('modify-doing').click()

    // Insert LAC2201
    cy.getCy('add-doing-search').type('LAC2201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 2').click()

    // Wait for module to be in list
    cy.getCy('build-list').contains('Chinese 2')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    checkLengths(1, 1)
  })

  it('Removes LAC1201 from modules done', () => {
    // Wait for modules to load
    cy.getCy('modify-done').click()
    cy.getCy('build-list').should('be.visible')

    // Delete LAC1201
    deleteModuleFromSettings('LAC1201')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    checkLengths(0, 1)
  })

  it('Removes LAC2201 from modules doing', () => {
    // Wait for modules to load
    cy.getCy('modify-doing').click()
    cy.getCy('build-list').should('be.visible')

    // Delete LAC2201
    deleteModuleFromSettings('LAC2201')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    checkLengths(0, 0)
  })
})
