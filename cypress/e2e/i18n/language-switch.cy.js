describe('Internacionalização', () => {
  it('deve trocar o idioma para inglês', () => {
    // cy.loginAsAdmin();
    cy.visit('/');
    cy.get('button[aria-label="Trocar idioma"]').click();
    cy.contains('English').click();
    cy.contains('Dashboard').should('be.visible');
  });
}); 