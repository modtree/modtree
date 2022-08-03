function assertGraphCount(n: number) {
  /** wait for the first node to load */
  cy.reduxUser().then((user) => {
    expect(user.savedGraphs).to.have.length(n)
  })
}

describe('planned, cannot take state', () => {
  before(() => {
    cy.login({ reset: true })
    cy.logout()
  })

  beforeEach(() => cy.login())

  it('Add CS1231 to graph', () => {
    cy.addGraphModule('CS1231', 'Discrete Structures')
    cy.getCy('node-CS1231-cannotTake').should('exist')
  })

  it('Teardown', () => {
    cy.removeGraphModule('CS1231')
    assertGraphCount(1)
  })
})
