describe("Testing", () => {

  it('1. Login: should show error message if Yup fields are empty', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('There must be an email').should('be.visible');
    cy.contains('There must be a password').should('be.visible');
  });

  it('2. Login: should show an error if email is not valid', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('not-an-email');
    cy.get('button[type="submit"]').click();
    cy.contains('Email not valid').should('be.visible');
  });

  it('4. Login: should login with success using Mocked Data', () => {
    cy.intercept('POST', '**/auth/login', {
      fixture: 'example.json'
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('input[name="email"]').type('testingUser@email.it');
    cy.get('input[name="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/home');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('streetcats_token')).to.eq('secret-invalid-token-12345');
    });
  });
})
