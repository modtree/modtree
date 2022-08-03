function assertGraphCount(n: number) {
  /** wait for the first node to load */
  cy.reduxUser().then((user) => {
    expect(user.savedGraphs).to.have.length(n)
  })
}

describe('planned state', () => {
  before(() => {
    cy.login({ reset: true })
    cy.logout()
  })

  beforeEach(() => cy.login())

  it('Add CS1010 to graph', () => {
    cy.addGraphModule('CS1010', 'Programming Methodology')
    cy.getCy('node-CS1010-planned').should('exist')
  })

  it('Teardown', () => {
    cy.removeGraphModule('CS1010')
    assertGraphCount(1)
  })
})
