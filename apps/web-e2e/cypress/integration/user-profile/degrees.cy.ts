/*
- create new degree
- rename degree
- add module
- remove module
- remove degree
 */

import { FRONTEND_URL } from '../../utils/constants'

const title = 'Original Title'
const newTitle = 'New Title'
let degreeCount
let modules = []

/**
 * Inserts a module into a degree
 */
function insertModule(moduleCode: string, title: string) {
  modules.push(moduleCode)
  return cy
    .getCy('degree-modules-search')
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
 * Check modules
 */
function checkModules() {
  const arr = []
  cy.getCy('degree-module').each((span) => {
    arr.push(span.text())
  }).then(() => {
    // Exact array match
    expect(arr).to.include.members(modules)
    expect(modules).to.include.members(arr)
  })
}

describe('degrees panel', () => {
  /**
   * Login
   */
  beforeEach(() => {
    cy.visit(FRONTEND_URL)
    cy.login()

    // open degrees panel
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

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    // Test that degree was added
    degreeCount++
    checkDegreeCount()
  })

  it('edit degree title', () => {
    // Edit last degree
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy="edit-button"]')
      .click()

    // Title
    cy.getCy('edit-degree-title').clear().type(newTitle)

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    checkDegreeCount()
  })

  it('add module to degree', () => {
    // Edit last degree
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy="edit-button"]')
      .click()

    // Add module
    insertModule('EL1101E', 'The Nature of Language')

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    checkDegreeCount()
  })

  it('remove module from degree', () => {
    // Edit last degree
    cy.get('[data-cy="degrees-list"] > div')
      .last()
      .find('[data-cy="edit-button"]')
      .click()

    // Remove last module
    modules.pop()
    cy.getCy('degree-modules-list')
      .children()
      .last()
      .find('[data-cy="delete-button"]')
      .click()

    // Check modules
    checkModules()

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
