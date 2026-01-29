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

  it('3. Login: should login with success using Mocked Data', () => {
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

  it('4. Register: should show error for passwords that are too short', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type('newUser');
    cy.get('input[name="email"]').type('newUserEmail@email.it');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.contains('Password must be at least 5 characters long').should('be.visible');
  });



  it('6. Map: should load markers for all cats', () => {
    cy.intercept('GET', '**/cats/**', { fixture: 'cat.json' }).as('getCats');
    cy.visit('/map');
    cy.wait('@getCats');

    cy.get('.leaflet-marker-icon').should('have.length.at.least', 1);
  });

  it('8. CatDetails: should show login message instead of text area to leave a comment in cat\'s page', () => {

    const catId = 1;

    cy.intercept('GET', `**/cats/${catId}`, { fixture: 'cat.json' }).as('getCat');
    cy.intercept('GET', `**/cats/${catId}/comments`, { fixture: 'comment.json' }).as('getComments');

    cy.visit(`/catdetails/${catId}`);

    cy.wait(['@getCat', '@getComments']);
    cy.contains('Login to comment!').should('be.visible');
  });


  it('9. CatDetails: should display correctly all cat\'s data', () => {
    const catId = 1;

    cy.intercept('GET', `**/cats/${catId}`, { fixture: 'cat.json' }).as('getCat');
    cy.intercept('GET', `**/cats/${catId}/comments`, { fixture: 'comment.json' }).as('getComments');

    cy.visit(`/catdetails/${catId}`);

    cy.wait(['@getCat', '@getComments']);

    cy.get('h1').should('contain', 'Another Cat');
    cy.contains('Majestic cat!').should('be.visible');
  })

  it('10. CatDetails: should show proper error when there\'s no image uploaded', () => {
    const mockUser = {
      username: "User",
      avatarUrl: null
    }
    const mockToken = 'jwt-token-12345';

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: mockUser,
        token: mockToken
      }
    }).as('loginRequest');

    cy.visit('/login');
    cy.get('input[name="email"]').type('user@streetcats.it');
    cy.get('input[name="password"]').type('passwordSicura123');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('include', 'home');

    cy.get(`.rounded-full > .w-full`).should('be.visible')
  });

});
