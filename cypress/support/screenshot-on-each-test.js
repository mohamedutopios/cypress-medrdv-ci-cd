
afterEach(function () {
  // Nom du screenshot basé sur le test
  const testTitle = this.currentTest.title
    .replace(/[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)

  const testState = this.currentTest.state // 'passed', 'failed', 'pending'
  const suiteName = this.currentTest.parent.title
    .replace(/[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)

  // Screenshot pour les tests réussis (les échecs sont déjà capturés par Cypress)
  if (testState === 'passed') {
    cy.screenshot(`${suiteName}/${testState}--${testTitle}`, {
      capture: 'viewport',
      overwrite: true,
    })
  }
})
