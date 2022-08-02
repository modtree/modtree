describe('add-and-remove', () => {
  const code = 'MA2104'
  const title = 'Multivariable Calculus'

  /** Reset user */
  before(() => {
    cy.login({ reset: true })
    cy.logout()
  })

  /** Login */
  beforeEach(() => cy.login())

  it('Graph does not contain MA2104', () => {
    cy.reduxGraph().then((graph) => {
      const moduleCodes = graph.flowNodes.map((n) => n.id)
      expect(moduleCodes).to.not.contain(code)
    })
  })

  it('adds a module', () => {
    cy.addGraphModule(code, title)
    cy.contains(code).should('be.visible')
  })

  it('cannot add the same module', () => {
    cy.openModuleModal(code, title).then(() => {
      // Should not have add to graph button
      cy.getCy('module-modal').contains('Add to graph').should('not.exist')

      // Close modal
      cy.getCy('module-modal-close-button').click()
    })
  })

  it('removes a module', () => {
    cy.removeGraphModule(code)
    cy.contains(code).should('not.exist')
  })

  it('can now add the same module', () => {
    cy.openModuleModal(code, title).then(() => {
      // Should have add to graph button
      cy.getCy('module-modal').contains('Add to graph').should('be.visible')

      // Close modal
      cy.getCy('module-modal-close-button').click()
    })
  })
})
