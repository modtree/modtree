const oldTitle = 'Original Title'
const newTitle = 'New Title'
let modules = []
import { validModuleRegex } from '../../../../../libs/utils/src/string'

/**
 * Inserts a module into a degree
 */
function insertModule(moduleCode: string, title: string) {
  const regexStr = `trpc\/search\/modules.*${moduleCode}`
  cy.intercept(new RegExp(regexStr)).as('search')
  modules.push(moduleCode)
  cy.getCy('degree-modules-search').clear().type(moduleCode)
  cy.wait('@search')
  cy.getCy('search-result').contains(title).click()
  // Wait for module to be added
  cy.getCy('degree-modules-list').contains(title)
}

/**
 * Check degree count
 */
function checkDegreeCount(n: number) {
  cy.getCy('degrees-list').children().its('length').should('eq', n)
}

/**
 * Check modules
 */
function checkModules() {
  const arr = []
  cy.getCy('degree-module')
    .filter('span')
    .each((span) => {
      const text = span.text()
      if (text.match(validModuleRegex)) arr.push(span.text())
    })
    .then(() => {
      // Exact array match
      expect(arr).to.include.members(modules)
      expect(modules).to.include.members(arr)
    })
}

describe('degrees panel', () => {
  /** Reset user */
  before(() => {
    cy.login({ reset: true })
    cy.logout()
  })

  /** Login */
  beforeEach(() => {
    cy.login()
    cy.reduxUser()

    // open modules panel
    cy.openUserProfile('Degrees')
  })

  it('create new degree', () => {
    cy.getCy('add-degree-button').click()

    // Degree props
    cy.getCy('add-degree-title').type(oldTitle)
    insertModule('CS1010S', 'Programming Methodology')
    insertModule('MA2001', 'Linear Algebra I')

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    // Wait for degree to be added
    cy.contains(oldTitle).should('be.visible')

    checkDegreeCount(2)
  })

  it('edit degree title', () => {
    // Edit degree
    cy.contains(oldTitle)
      .parent()
      .parent()
      .find('[data-cy="edit-button"]')
      .click()

    // Title
    cy.getCy('edit-degree-title').clear().type(newTitle)

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    // Check that title has changed
    cy.getCy('degrees-list')
    cy.contains(oldTitle).should('not.exist')
    cy.contains(newTitle).should('be.visible')

    checkDegreeCount(2)
  })

  it('add module to degree', () => {
    // Edit degree
    cy.contains(newTitle)
      .parent()
      .parent()
      .find('[data-cy="edit-button"]')
      .click()

    // Add module
    insertModule('EL1101E', 'The Nature of Language')

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    checkDegreeCount(2)
  })

  it('remove module from degree', () => {
    // Edit degree
    cy.contains(newTitle)
      .parent()
      .parent()
      .find('[data-cy="edit-button"]')
      .click()

    // Remove last module
    const lastModuleCode = modules.pop()
    cy.contains(lastModuleCode)
      .parent()
      .parent()
      .find('[data-cy="delete-button"]')
      .click()

    // Check modules
    checkModules()

    // Save degree
    cy.get('button').contains('Save degree').click()

    checkDegreeCount(2)
  })

  it('remove degree', () => {
    // Remove degree
    cy.contains(newTitle)
      .parent()
      .parent()
      .find('[data-cy="delete-button"]')
      .click()

    // Wait for degree to be deleted
    cy.getCy('degrees-list')
    cy.contains(newTitle).should('not.exist')

    checkDegreeCount(1)
  })
})
