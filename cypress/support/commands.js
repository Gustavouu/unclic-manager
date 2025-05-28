Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('admin@teste.com');
  cy.get('input[name="senha"]').type('senha123');
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
}); 