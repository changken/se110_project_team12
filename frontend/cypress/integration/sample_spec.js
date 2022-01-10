const { access_token, username } = require('./env');

let LOCAL_STORAGE_MEMORY = {
  access_token,
  username,
};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

describe('test login', () => {
  beforeEach(() => {
    cy.wait(2000); //等兩秒
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('login test', () => {
    cy.visit('http://localhost:3001');

    cy.get('#username').type('changken');
    cy.get('#password').type('123');

    cy.contains('Login').click();

    cy.url().should('include', 'select');
  });

  it("gitlab list user's repository test", () => {
    cy.visit('http://localhost:3001/select');

    //click add project
    cy.get('.MuiButtonBase-root.MuiCardActionArea-root').click();

    cy.contains('You had already login Gitlab!');
    cy.contains('Your currently login username is changken');

    cy.contains('Changken Wallet');

    cy.get('#21380487').click();

    cy.url().should('include', 'gitlabcommits').should('include', '21380487');
  });

  it('gitlab commit page test', () => {
    // cy.visit('http://localhost:3001/gitlabcommits/21380487');

    cy.contains('Team');
    cy.contains('Member');

    cy.get('#startMonthYear').click();

    cy.contains('2018').click();
    cy.contains('OK').click();
  });

  it('gitlab issue page test', () => {
    cy.contains('Issue').click();

    cy.contains('Team');
  });

  it('gitlab code base page test', () => {
    cy.contains('Code Base').click();

    cy.contains('Team');
  });

  it('gitlab merge request page test', () => {
    cy.contains('Merge Request').click();

    cy.contains('Merge Request');
  });

  it('gitlab branch page test', () => {
    cy.contains('Branch').click();

    cy.contains('Branch which last committed at');
  });
});
