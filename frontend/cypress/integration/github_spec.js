let LOCAL_STORAGE_MEMORY = {};

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

describe('test github', () => {
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

  //TODO add project & add github repository
  //   it('add project & add github repository', () => {});

  it('click a github repository', () => {
    cy.contains('se110_project_team12').click();

    cy.url().should('include', 'dashboard');

    cy.contains('se110_project_team12');

    // expect(localStorage.getItem('projectId')).to.equal(8);
  });

  it('github commit page test', () => {
    cy.contains('Commits').click();

    cy.url().should('include', 'commits');

    cy.contains('Team');

    cy.contains('Member');
    cy.wait(7000);
  });

  it('github issue page test', () => {
    cy.contains('Issues').click();

    cy.url().should('include', 'issues');

    cy.contains('Team');
    cy.wait(7000);
  });

  it('github code base page test', () => {
    cy.contains('Code Base').click();

    cy.url().should('include', 'codebase');

    cy.contains('Team');
  });
});
