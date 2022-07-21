let doneCount
let doingCount

function getInitialLengths() {
  cy.getCy('done-section')
    .children()
    .its('length')
    .then((n) => {
      doneCount = n
    })
  cy.getCy('doing-section')
    .children()
    .its('length')
    .then((n) => {
      doingCount = n
    })
}

/**
 * Waits for modules to load
 */
function waitForLoad() {
  cy.getCy('done-section')
  cy.getCy('doing-section')
}

/**
 * Checks for correct number of modules
 */
function checkLengths() {
  cy.get('[data-cy="done-section"] > div').should('have.length', doneCount)
  cy.get('[data-cy="doing-section"] > div').should('have.length', doingCount)
}

describe('modules panel', () => {
  beforeEach(() => {
    // Extra wait for increased stability
    cy.wait(2000)
    cy.login()
    cy.reload()

    // open modules panel
    cy.getCy('modtree-user-circle').then((icon) => {
      icon.click()
      cy.contains('Your profile').click()
      cy.contains('Modules').click()
    })

    waitForLoad()
    // count current modules done and modules doing
    // only do it once for initial load
    if (!doneCount && !doingCount) {
      getInitialLengths()
    }
  })

  it('User does not contain LAC1201 and LAC2201', () => {
    cy.get('[data-cy="done-module"]').each((el) => {
      expect(el.text()).to.not.equal('LAC1201')
      expect(el.text()).to.not.equal('LAC2201')
    })
    cy.get('[data-cy="doing-module"]').each((el) => {
      expect(el.text()).to.not.equal('LAC1201')
      expect(el.text()).to.not.equal('LAC2201')
    })
  })

  it('Adds LAC1201 to modules done', () => {
    // Wait for modules to load
    cy.getCy('modify-done').click()
    cy.getCy('build-list').should('be.visible')

    // Insert LAC1201
    cy.getCy('add-done-search').type('LAC1201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 1').click()

    // Wait for module to be in list
    cy.getCy('build-list').contains('Chinese 1')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    doneCount++
    checkLengths()
  })

  it('Adds LAC2201 to modules doing', () => {
    // Wait for modules to load
    cy.getCy('modify-doing').click()
    cy.getCy('build-list').should('be.visible')

    // Insert LAC2201
    cy.getCy('add-doing-search').type('LAC2201')
    cy.get('[id^=headlessui-combobox-option]').contains('Chinese 2').click()

    // Wait for module to be in list
    cy.getCy('build-list').contains('Chinese 2')
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    doingCount++
    checkLengths()
  })

  it('Removes LAC1201 from modules done', () => {
    // Wait for modules to load
    cy.getCy('modify-done').click()
    cy.getCy('build-list').should('be.visible')

    // Delete last module
    cy.get('[data-cy="build-list"] > div')
      .last()
      .find('[data-cy="delete-button"]')
      .click()
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    doneCount--
    checkLengths()
  })

  it('Removes LAC2201 from modules doing', () => {
    // Wait for modules to load
    cy.getCy('modify-doing').click()
    cy.getCy('build-list').should('be.visible')

    // Delete last module
    cy.get('[data-cy="build-list"] > div')
      .last()
      .find('[data-cy="delete-button"]')
      .click()
    cy.get('button').contains('Save changes').click()

    waitForLoad()
    doingCount--
    checkLengths()
  })
})
