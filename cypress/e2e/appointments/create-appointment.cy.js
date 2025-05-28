describe('Agendamento', () => {
  it('deve criar um novo agendamento', () => {
    // cy.loginAsAdmin();
    cy.visit('/agendamentos');
    cy.get('button').contains('Novo Agendamento').click();
    cy.get('input[name="cliente"]').type('Cliente Teste');
    cy.get('input[name="profissional"]').type('Profissional Teste');
    cy.get('input[name="data"]').type('2024-05-20');
    cy.get('input[name="hora"]').type('10:00');
    cy.get('form').submit();
    cy.contains('Agendamento criado com sucesso').should('be.visible');
  });
}); 