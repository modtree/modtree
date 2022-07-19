/*
- create new degree
- rename degree
- add module
- remove module
- remove degree
 */

import { FRONTEND_URL } from '../../utils/constants'

const title = 'Very Specific Degree Title'
let degreeCount
let moduleCount = 0

/**
 * Inserts a module into a degree
 */
function insertModule(moduleCode: string, title: string) {
  moduleCount++
  return cy
    .getCy('add-degree-modules')
    .clear()
    .type(moduleCode)
    .then(() => {
      cy.getCy('search-result').contains(title).click()
      // Wait for module to be added
      cy.getCy('degree-modules-list').contains(title)
    })
}

/**
 * Gets initial degree count
 */
function getInitialCounts() {
  cy.getCy('degrees-list')
    .children()
    .its('length')
    .then((n) => {
      degreeCount = n
    })
}

/**
 * Check degree count
 */
function checkDegreeCount() {
  cy.getCy('degrees-list').children().its('length').should('eq', degreeCount)
}

/**
 * Check module count
 */
function checkModuleCount() {
  cy.getCy('degree-modules-list')
    .children()
    .its('length')
    .should('eq', moduleCount)
}

describe('degrees panel', () => {
  /**
   * Login
   */
  beforeEach(() => {
    cy.visit(FRONTEND_URL)
    cy.login()

    // open modules panel
    cy.getCy('modtree-user-circle').then((icon) => {
      icon.click()
      cy.contains('Your profile').click()
      cy.contains('Degrees').click()

      // count current degrees
      // only do for initial load
      if (!degreeCount) {
        getInitialCounts()
      }
    })
  })

  it('create new degree', () => {
    cy.getCy('add-degree-button').click()

    // Degree props
    cy.getCy('add-degree-title').type(title)
    insertModule('CS1010S', 'Programming Methodology')
    insertModule('MA2001', 'Linear Algebra I')

    // Check module count
    checkModuleCount()

    // Save degree
    cy.get('button').contains('Save degree').click()

    // Test that degree was added
    degreeCount++
    checkDegreeCount()
  })

  it('edit degree title', () => {
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy="edit-button"]')
      .click()

    // Title
    cy.getCy('edit-degree-title').type(title)

    // Check module count
    checkModuleCount()

    // Save degree
    cy.get('button').contains('Save degree').click()

    checkDegreeCount()
  })

  it('remove degree', () => {
    // Click trash icon of the last degree
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy=delete-button]')
      .click()

    // Wait for degree to be deleted
    // Waiting for title to disappear is not reliable enough
    cy.wait(3000)
    degreeCount--
    checkDegreeCount()
  })
})
