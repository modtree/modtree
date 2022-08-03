function assertGraphCount(n: number) {
  /** wait for the first node to load */
  cy.reduxUser().then((user) => {
    expect(user.savedGraphs).to.have.length(n)
  })
}

describe('update module state', () => {
  before(() => {
    cy.login({ reset: true })
    cy.logout()
  })

  beforeEach(() => cy.login())

  it('Add CS1231 to graph', () => {
    cy.addGraphModule('CS1231', 'Discrete Structures')
    cy.getCy('node-CS1231-cannotTake').should('exist')
  })

  it('Add CS1231 to modules doing', () => {
    cy.openUserProfile('Modules')
    cy.getCy('modify-doing').click()
    cy.getCy('add-doing-search').clear().type('CS1231')
    cy.getCy('search-result').contains('CS1231').click()
    cy.getCy('build-list').should('contain.text', 'CS1231')
    cy.get('button').contains('Save changes').click()
    cy.closeUserProfile()
  })

  it("CS1231's type should be doing", () => {
    cy.getCy('node-CS1231-cannotTake').should('not.exist')
    cy.getCy('node-CS1231-doing').should('exist')
  })

  it('Teardown', () => {
    cy.removeGraphModule('CS1231')
    assertGraphCount(1)
  })
})
