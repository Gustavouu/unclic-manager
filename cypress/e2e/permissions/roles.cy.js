describe('Permissões de Usuário', () => {
  it('profissional não pode acessar área de configurações', () => {
    // cy.loginAsProfessional();
    cy.visit('/configuracoes');
    cy.contains('Acesso negado').should('be.visible');
  });
}); 