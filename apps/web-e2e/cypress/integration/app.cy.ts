describe('web', () => {
  beforeEach(() => cy.visit('http://localhost:3000/'))

  // it('should display welcome message', () => {
  //   // Custom command example, see `../support/commands.ts` file
  //   cy.login('my-email@something.com', 'myPassword')
  //
  //   // Function helper example, see `../support/app.po.ts` file
  //   getGreeting().contains('Welcome web')
  // })

  it('should display react-flow', () => {
    cy.get('.react-flow__pane.react-flow__container').click()
  })

  it('should select the search box', () => {
    cy.intercept('GET', '/search/modules/CS1010S').as('searchModules')
    cy.get('[id^=headlessui-combobox-input-]').type('CS1010S')
    /* eslint-disable cypress/no-unnecessary-waiting */
    // TODO: wait for the resolution of the search itself, instead of an arbitrary time.
    cy.wait('@searchModules')
    cy.get('[id^=headlessui-combobox-option]')
      .contains('Programming Methodology')
      .click()
    cy.get('h1').should('have.text', 'CS1010S')
    cy.get('h2').should('have.text', 'Programming Methodology')
    cy.get('#module-modal-close-button').click()
  })
})
