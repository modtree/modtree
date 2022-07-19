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

/**
 * Inserts a module into a degree
 */
function insertModule(moduleCode: string, title: string) {
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
    // Title
    cy.getCy('add-degree-title').type(title)
    // Insert modules
    insertModule('CS1010S', 'Programming Methodology')
    insertModule('MA2001', 'Linear Algebra I')
    // Save degree
    cy.get('button').contains('Save degree').click()

    // Test that degree was added
    degreeCount++
    checkDegreeCount()
  })

  it('remove degree', () => {
    // Click trash icon of the last degree
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy="TrashIcon"]')
      .click()

    // Wait for degree to be deleted
    // Waiting for title to disappear is not reliable enough
    cy.wait(3000)
    degreeCount--
    checkDegreeCount()
  })
})
