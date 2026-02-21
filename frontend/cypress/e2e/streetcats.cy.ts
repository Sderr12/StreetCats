describe("StreetCats E2E - Real Integration Suite", () => {
  let registeredEmail;
  let registeredPassword = 'Password123!';

  it('1. Register: should successfully register a new user and redirect to home', () => {
    const uniqueId = Date.now();
    registeredEmail = `test${uniqueId}@email.it`;

    cy.visit('/register');
    cy.get('input[name="username"]').type(`user${uniqueId}`);
    cy.get('input[name="email"]').type(registeredEmail);
    cy.get('input[name="password"]').type(registeredPassword);
    cy.get('input[name="confirmPassword"]').type(registeredPassword);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/home');
  });

  it('2. Login: should show error message if Yup fields are empty', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('There must be an email').should('be.visible');
    cy.contains('There must be a password').should('be.visible');
  });

  it('3. Login: should show an error if email is not valid', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('not-an-email');
    cy.get('button[type="submit"]').click();
    cy.contains('Email not valid').should('be.visible');
  });

  it('4. Login: should login with success using the user just registered', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(registeredEmail);
    cy.get('input[name="password"]').type(registeredPassword);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
  });

  it('5. Register: should show error for passwords that are too short', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type('newUser');
    cy.get('input[name="email"]').type('newUserEmail@email.it');
    cy.get('input[name="password"]').type('123');
    cy.get('input[name="confirmPassword"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 5 characters long').should('be.visible');
  });

  it('6. SpotCat: should create a real sighting', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(registeredEmail);
    cy.get('input[name="password"]').type(registeredPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');

    cy.visit('/spot');

    const fileName = 'cat_test.jpg';
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGA6zk4QgAAAABJRU5ErkJggg==';

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Blob.base64StringToBlob(imageData, 'image/jpeg'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });

    cy.get('input[name="title"]').type('Real Test Cat');

    cy.contains('button', 'Expand Map').click();
    cy.get('.leaflet-container', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click('center', { force: true });

    cy.contains('button', 'Confirm Location').click();
    cy.get('body').should('not.have.css', 'overflow', 'hidden'); // Verifica che il modal sia chiuso

    cy.get('textarea[name="description"]').type('Sighting with real **Markdown** details');

    cy.contains('button', 'Publish Sighting').should('not.be.disabled').click();

    cy.url({ timeout: 25000 }).should('match', /\/catdetails\//);
  });

  it('7. SpotCat: should show the error if you try to spot a cat without uploading a photo', () => {
    cy.loginFunct(registeredEmail, registeredPassword);
    cy.visit('/spot');
    cy.get('button[type="submit"]').click();
    cy.contains('A photo is required!').should('be.visible');
  });

  it('8. Map: should load markers from the real database', () => {
    cy.visit('/map');
    cy.get('.leaflet-marker-icon', { timeout: 15000 }).should('exist');
  });

  it('9. CatDetails: should show login message in comments for guests', () => {
    cy.visit('/catdetails/1');
    cy.contains(/Login to/i).should('be.visible');
  });

  it('10. CatDetails: should show real user avatar when logged', () => {
    cy.loginFunct(registeredEmail, registeredPassword);
    cy.visit('/home');
    cy.get('img, .rounded-full').should('be.visible');
  });

  it('11. Comment: should enable button when typing', () => {
    cy.loginFunct(registeredEmail, registeredPassword);
    cy.visit('/catdetails/1');
    cy.get('textarea').first().type('Commento di prova reale');
    cy.contains('button', /Post|Submit/i).should('not.be.disabled');
  });

  it('12. Map Modal: should block body scroll', () => {
    cy.loginFunct(registeredEmail, registeredPassword);
    cy.visit('/spot');
    cy.contains('button', 'Expand Map').click();
    cy.get('body').should('have.css', 'overflow', 'hidden');
    cy.contains('button', 'Confirm Location').click();
    cy.get('body').should('not.have.css', 'overflow', 'hidden');
  });

});
