describe('assert starting user state', () => {
  let graph: Cypress.ReduxState['graph']
  let user: Cypress.ReduxState['modtree']['user']
  let degree: Cypress.ReduxState['modtree']['degree']
  before(() => {
    cy.login()
    cy.resetUser()
    cy.reduxState().then((state) => {
      user = state.modtree.user
      degree = state.modtree.degree
      graph = state.graph
    })
  })

  it('user has 1 saved degree', () => {
    expect(user.savedDegrees).to.have.length(1)
  })

  it('user has 1 saved graph', () => {
    expect(user.savedGraphs).to.have.length(1)
  })

  it('graph has no nodes', () => {
    expect(graph.flowEdges).to.have.length(0)
  })

  it('user has no modules done', () => {
    expect(user.modulesDone).to.have.length(0)
  })

  it('user has no modules doing', () => {
    expect(user.modulesDoing).to.have.length(0)
  })

  it('graph id matches saved', () => {
    expect(graph.id).to.equal(user.savedGraphs[0])
  })

  it('degree id matches saved', () => {
    expect(degree.id).to.equal(user.savedDegrees[0])
  })
})
