const code = 'MA2104'
const title = 'Multivariable Calculus'

describe('add-and-remove', () => {
  beforeEach(() => {
    cy.login()
    cy.reload()
  })

  it('Graph does not contain MA2104', () => {
    // getUser has completed
    // Wait for store to load
    cy.wait(2000)
    cy.window()
      .its('store')
      .invoke('getState')
      .its('modtree.graph.flowNodes')
      .then((nodes) => {
        const moduleCodes = nodes.map((n) => n.id)
        expect(moduleCodes).to.not.contain('MA2104')
      })
  })

  it('adds a module', () => {
    cy.addGraphModule(code, title)
    cy.contains(code).should('be.visible')
  })

  it('cannot add the same module', () => {
    cy.loadModuleModal(code, title).then(() => {
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
    cy.loadModuleModal(code, title).then(() => {
      // Should have add to graph button
      cy.getCy('module-modal').contains('Add to graph').should('be.visible')

      // Close modal
      cy.getCy('module-modal-close-button').click()
    })
  })
})
