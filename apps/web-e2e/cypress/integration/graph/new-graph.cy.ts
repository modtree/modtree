function assertGraphCount(n: number) {
  /** wait for the first node to load */
  cy.get('.react-flow__pane')
  cy.wait('@getGraph')
  cy.window()
    .its('store')
    .invoke('getState')
    .its('modtree.user.savedGraphs')
    .then((graphs) => {
      expect(graphs).to.have.length(n)
    })
}

describe('add-and-remove', () => {
  beforeEach(() => {
    cy.intercept('GET', /.*graph.*/).as('getGraph')
    cy.login()
  })

  it('Add a new graph', () => {
    assertGraphCount(1)
    cy.addGraph('test-graph')
  })

  it('Add CS1231 to modules done', () => {
    cy.openUserProfile('Modules')
    cy.getCy('modify-doing').click()
    cy.getCy('add-doing-search').clear().type('CS1231')
    cy.getCy('search-result').contains('CS1231').click()
    cy.getCy('build-list').should('contain.text', 'CS1231')
    cy.get('button').contains('Save changes').click()
    cy.closeUserProfile()
  })

  it('Add CS1231 to graph', () => {
    cy.addGraphModule('CS1231', 'Discrete Structures')
    cy.getCy('node-CS1231-planned').should('exist')
  })

  it('Teardown', () => {
    cy.removeGraphModule('CS1231')
    cy.removeGraph('test-graph')
    assertGraphCount(1)
  })
})
