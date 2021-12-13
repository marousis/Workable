// Import packages to preserve local storage
import "cypress-localstorage-commands";

// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const login_path = "login";
const login_btn = ".btn";
const email = "#email";
const password = "#password";
const new_db_path = "tasks/db";
const db_btn = "#task_db";
const first_task_title = ":nth-child(1) > .card-content > #card_title";
const search_bar = "#search";

//Data
const email_valid = "marousis@gmail.com";
const password_valid = "27021989";
const db_btn_text = "TaskDB";
const filename = "tasks.json";

context("Tests for all tasks - TaskDB Section", () => {
  before(() => {
    // Before starting the suite clear any local storage snapshots created and login
    cy.clearLocalStorageSnapshot();
    cy.visit(base_url + login_path);
    cy.url().should("eq", base_url + login_path);
    cy.get(email).type(email_valid, { force: true });
    cy.get(password).type(password_valid, { force: true });
    cy.get(login_btn).click();
  });

  beforeEach(() => {
    // Before eatch test restore the local storage in order to run the test
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    // After eatch test preserve the local storage for the next test
    cy.saveLocalStorage();
  });
  it("Assert all tasks are visible", () => {
    cy.intercept("/api/alltasks").as("alltasks");
    cy.get(db_btn)
      .should("be.visible")
      .should("contain", db_btn_text)
      .click()
      .wait("@alltasks")
      .then((xhr) => {
        let all_tasks = JSON.stringify(xhr.response.body.tasks);
        cy.log(all_tasks);
        cy.writeFile(filename, all_tasks);
        cy.readFile("tasks.json").each((item) => {
          cy.contains(item.summary).should("be.visible");
          cy.contains(item.description).should("be.visible");
        });
      });
  });
  it("Search for a task in TaskDB", () => {
    cy.get(first_task_title)
      .invoke("text")

      .then((value) => {
        let title = value;
        cy.get(search_bar).click().type(title, { delay: 250 }, { force: true });
        cy.contains(title).should("be.visible");
      });
  });
});
