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
    cy.openUserProfile('Graphs')
    cy.get('button').contains('New graph').click()
    cy.getCy('add-graph-title').clear().type('test-graph')
    cy.get('button').contains('Save graph').click()
    cy.closeUserProfile()
  })

  it('Remove created graph', () => {
    cy.openUserProfile('Graphs')
    cy.get('div')
      .contains('test-graph')
      .parent()
      .within(() => {
        cy.getCy('delete-button').click()
      })
    cy.closeUserProfile()
  })

  it('User has one graph again', () => {
    assertGraphCount(1)
  })
})
