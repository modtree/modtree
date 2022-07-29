describe('assert starting user state', () => {
  before(() => {
    cy.login()
    cy.resetUser()
  })

  it('graph state', () => {
    cy.reduxGraph().then((graph) => {
      expect(graph.flowNodes).to.have.length(0)
    })
  })

  it('user state', () => {
    cy.reduxUser().then((user) => {
      expect(user.savedGraphs).to.have.length(1)
      expect(user.savedDegrees).to.have.length(1)
      expect(user.modulesDone).to.have.length(0)
      expect(user.modulesDoing).to.have.length(0)
    })
  })

  it('degree state', () => {
    cy.reduxDegree().then((degree) => {
      expect(degree.modules.length).to.be.oneOf([0, 10])
    })
  })
})
