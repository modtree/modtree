import { FRONTEND_URL } from '../../utils/constants'

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
    cy.getCy('modtree-user-circle').then((icon) => {
      icon.click()
      cy.contains('Your profile').click()
      cy.contains('Modules').click()
    })

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
    cy.get('[data-cy="build-list"] > div')
      .last()
      .find('[data-cy="delete-button"]')
      .click()
    cy.get('button').contains('Save changes').click()

    doneCount--
    checkLengths()
  })

  it('Removes from modules doing', () => {
    // remove last module from modules doing (LAC2201)
    cy.getCy('modify-doing').click()
    cy.getCy('build-list').should('be.visible')
    // get trash button of last module in list
    cy.get('[data-cy="build-list"] > div')
      .last()
      .find('[data-cy="delete-button"]')
      .click()
    cy.get('button').contains('Save changes').click()

    doingCount--
    checkLengths()
  })
})
