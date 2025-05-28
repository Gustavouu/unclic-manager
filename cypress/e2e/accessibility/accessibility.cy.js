describe('Acessibilidade', () => {
  it('deve passar nos principais critérios de acessibilidade na tela de login', () => {
    cy.visit('/login');
    cy.injectAxe();
    cy.checkA11y();
  });
}); 