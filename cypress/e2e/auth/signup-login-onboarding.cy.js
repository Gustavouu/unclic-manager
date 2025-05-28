describe('Fluxo de cadastro, login e onboarding', () => {
  const uniqueEmail = `novo_usuario_${Date.now()}@teste.com`;

  it('deve cadastrar, logar e completar onboarding', () => {
    // Cadastro
    cy.visit('/signup');
    cy.get('input[name="nome"]').type('Usuário Teste');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="senha"]').type('senha123');
    cy.get('form').submit();
    cy.contains('Cadastro realizado').should('be.visible');

    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="senha"]').type('senha123');
    cy.get('form').submit();
    cy.url().should('include', '/onboarding');

    // Onboarding
    cy.get('input[name="nome_empresa"]').type('Empresa Teste');
    cy.get('form').submit();
    cy.contains('Dashboard').should('be.visible');
  });

  it('não deve acessar dados de outro negócio (RLS)', () => {
    // Supondo que o usuário já está logado e onboarding completo
    // Tente acessar um endpoint/rota de outro negócio
    cy.request({
      url: '/api/clientes?negocio=uuid-de-outro-negocio',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 403, 404]);
    });
  });
}); 