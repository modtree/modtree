function assertGraphCount(n: number) {
  /** wait for the first node to load */
  cy.get('.react-flow__node')
  cy.window()
    .its('store')
    .invoke('getState')
    .its('modtree.user.savedGraphs')
    .then((graphs) => {
      expect(graphs).to.have.length(n)
    })
}

describe('add-and-remove', () => {
  beforeEach(() => cy.login())

  it('User has only one graph', () => {
    assertGraphCount(1)
  })

  it('Add a new graph', () => {
    cy.addGraph('test-graph')
  })

  it('Remove created graph', () => {
    cy.removeGraph('test-graph')
  })

  it('User has one graph again', () => {
    assertGraphCount(1)
  })
})
