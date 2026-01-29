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


  it('5. SpotCat: should display correctly every form completed', () => {
    // This is a function defined in support/commands.ts, helpfull in order to achive DRY.
    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/spot');
    cy.intercept('POST', '**/cats', {
      statusCode: 201,
      body: { id: '999' }
    }).as('postCat');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file-content'),
      fileName: 'gatto_test.jpg',
      lastModified: Date.now(),
    }, { force: true });

    cy.get('img[alt="Preview"]').should('be.visible');

    cy.get('input[name="title"]').type('Gatto Rosso Imperiale');

    cy.get('.leaflet-container').click();
    cy.get('.leaflet-marker-icon').should('be.visible');

    cy.get('textarea[name="description"]').type('Un gatto molto **coraggioso** trovato vicino al Colosseo.');

    cy.contains('button', 'Preview').click();
    cy.get('.prose strong').should('have.text', 'coraggioso');
    cy.contains('button', 'Write').click();

    cy.contains('button', 'Publish Sighting').click();


    cy.url().should('include', '/catdetails/999');

  })

  it('6. SpotCat: should show the error if you try to spot a cat without uploading a photo', () => {

    cy.loginFunct('testingUser@email.it', '12345');
    cy.visit('/spot');
    cy.intercept('POST', '**/cats').as('postCat');

    cy.get('input[name="title"]').type('Invisible cat');

    cy.get('.leaflet-container').click(100, 100);

    cy.get('textarea[name="description"]').type('Thi cat is just a test');

    cy.contains('button', 'Publish Sighting').click();

    cy.contains("A photo is required!")
      .should('be.visible');

    cy.url().should('include', '/spot');

    cy.get('@postCat.all').should('have.length', 0);
  });

  it('7. Map: should load markers for all cats', () => {
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


  it('11. Comment: should not submit a comment if the text area is empty', () => {
    const catId = 1;
    cy.loginFunct('testingUser@email.it', '12345');

    cy.intercept('GET', `**/cats/${catId}`, {
      fixture: 'cat.json'
    }).as('getCat');

    cy.intercept('GET', `**/cats/${catId}/comments`, {
      body: []
    }).as('getComments');

    cy.visit(`/catdetails/${catId}`);
    cy.wait(['@getCat', '@getComments']);

    cy.get('textarea[placeholder="Leave a comment..."]')
      .should('have.value', '');

    cy.contains('button', 'Submit')
      .should('be.disabled');

    // Proviamo a scrivere solo spazi
    cy.get('textarea[placeholder="Leave a comment..."]')
      .type('     ');

    cy.contains('button', 'Submit')
      .should('be.disabled');

    cy.get('textarea[placeholder="Leave a comment..."]')
      .clear()
      .type('Che bel gattone!');

    cy.contains('button', 'Submit')
      .should('not.be.disabled');

    cy.get('textarea[placeholder="Leave a comment..."]')
      .clear();

    cy.contains('button', 'Submit')
      .should('be.disabled');
  });

});
