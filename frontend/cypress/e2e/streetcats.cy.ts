describe("StreetCats E2E - Testing Suite", () => {

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

  it('3. Login: should login with success using Mocked Data', () => {
    cy.intercept('POST', '**/auth/login', { fixture: 'example.json' }).as('loginRequest');
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

  it('4. Register: should show error for passwords that are too short', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type('newUser');
    cy.get('input[name="email"]').type('newUserEmail@email.it');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 5 characters long').should('be.visible');
  });


  it('5. SpotCat: should display correctly every form completed', () => {
    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/spot');
    cy.intercept('POST', '**/cats', { statusCode: 201, body: { id: '999' } }).as('postCat');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file-content'),
      fileName: 'gatto_test.jpg',
    }, { force: true });

    cy.get('input[name="title"]').type('Gatto Rosso Imperiale');
    cy.contains('button', 'Expand Map').click();
    cy.get('.fixed .leaflet-container').click();
    cy.contains('button', 'Confirm Location').click();

    cy.get('textarea[name="description"]').type('Un gatto molto **coraggioso**');
    cy.contains('button', 'Publish Sighting').click();
    cy.url().should('include', '/catdetails/999');
  });

  it('6. SpotCat: should show the error if you try to spot a cat without uploading a photo', () => {
    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/spot');

    cy.get('button[type="submit"]').click();

    cy.contains('A photo is required!').should('be.visible');
  });


  it('7. Map: should load markers for all cats', () => {
    cy.intercept('GET', '**/cats', { fixture: 'cat.json' }).as('getCats');
    cy.visit('/map');
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).should('exist');
  });

  it('8. CatDetails: should show login message in comments section', () => {
    const catId = 1;
    cy.intercept('GET', `**/cats/${catId}`, { fixture: 'cat.json' }).as('getCat');
    cy.intercept('GET', `**/cats/${catId}/comments`, { body: [] }).as('getComments');
    cy.visit(`/catdetails/${catId}`);
    cy.contains(/Login to/i).should('be.visible');
  });

  it('9. CatDetails: should display correctly all cat\'s data with Markdown', () => {
    const catId = 1;
    cy.intercept('GET', `**/cats/${catId}`, {
      body: {
        id: 1,
        title: 'Another Cat',
        description: 'Majestic **cat**!',
        photo: 'https://via.placeholder.com/150',
        latitude: 41,
        longitude: 12,
        createdAt: new Date().toISOString()
      }
    }).as('getCatData');

    cy.intercept('GET', `**/cats/${catId}/comments`, { body: [] }).as('getCommentsData');

    cy.visit(`/catdetails/${catId}`);

    cy.wait(['@getCatData', '@getCommentsData']);

    cy.get('h1').should('contain', 'Another Cat');

    cy.get('strong, b', { timeout: 10000 }).contains('cat').should('be.visible');
  });

  it('10. CatDetails: should show proper avatar when user is logged', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { user: { username: "User" }, token: 'jwt-token' }
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[name="email"]').type('user@streetcats.it');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'home');
    cy.get('img, .rounded-full').should('be.visible');
  });

  it('11. Comment: should handle button states correctly', () => {
    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/catdetails/1');
    cy.get('textarea').first().type('Bel gatto');
    cy.contains('button', /Post|Submit/i).should('not.be.disabled');
  });

  it('12. Markdown Links: should ensure links in description have correct target', () => {
    cy.intercept('GET', '**/cats/99', {
      body: { id: 99, title: 'Link', description: '[Google](https://google.com)', photo: 'x.jpg' }
    });
    cy.visit('/catdetails/99');
    cy.get('a[href*="google.com"]').should('have.attr', 'target', '_blank');
  });

  it('13. Map Modal: should block body scroll', () => {
    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/spot');
    cy.contains('button', 'Expand Map').click();
    cy.get('body').should('have.css', 'overflow', 'hidden');

    cy.contains('button', 'Confirm Location').click();
    cy.get('body').should('not.have.css', 'overflow', 'hidden');
  });

});
