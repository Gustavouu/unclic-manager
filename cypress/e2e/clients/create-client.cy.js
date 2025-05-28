describe('Cadastro de Cliente', () => {
  it('deve cadastrar um novo cliente com dados válidos', () => {
    // cy.loginAsAdmin(); // Supondo comando customizado para login
    cy.visit('/clientes');
    cy.get('button').contains('Novo Cliente').click();
    cy.get('input[name="nome"]').type('Cliente Teste');
    cy.get('input[name="email"]').type('cliente@teste.com');
    cy.get('input[name="telefone"]').type('11999999999');
    cy.get('form').submit();
    cy.contains('Cliente Teste').should('exist');
  });
}); 