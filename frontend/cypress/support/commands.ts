/// <reference types="cypress" />
Cypress.Commands.add("loginFunct", (email, password) => {
  cy.intercept('POST', '**/auth/login', {
    fixture: 'example.json'
  }).as('loginRequest');

  cy.visit('/login');

  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.wait('@loginRequest');

  cy.url().should('include', '/home');
});


declare namespace Cypress {
  interface Chainable {
    loginFunct(email: string, password: string): Chainable<void>;
  }
}
