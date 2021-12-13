// Import packages to preserve local storage
import "cypress-localstorage-commands";

// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const login_path = "login";
const login_btn = ".btn";
const email = "#email";
const password = "#password";
const name = "#name";
const description = "#description";
const final_create_btn = ".btn";
const update_btn = ".btn";
const first_project = ":nth-child(1) > .row > .col > .card >";
const project_name = ".card-content > .card-title";
const project_delete_btn = ".card-action > #delete_project";

//Data
const email_valid = "marousis@gmail.com";
const password_valid = "27021989";
const create_btn = "Create";
let random_project_name = (Math.random() + 1).toString(36);
let random_project_dercription = (Math.random() + 1).toString(36);
let random_edit_project_name = (Math.random() + 1).toString(36);
let random_edit_project_dercription = (Math.random() + 1).toString(36);
const final_create_btn_text = "Create";
const edit_btn_text = "Edit";
const update_btn_text = "Update";
const delete_btn_text = "Delete";

context("Project tests", () => {
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
  it("Creating a new project", () => {
    // add negative assertions
    cy.wait(1000);
    cy.intercept("/api/projects").as("newproject");
    cy.contains(create_btn).should("be.visible").click();

    cy.get(name)
      .should("be.visible")
      .type(random_project_name, { force: true });
    cy.get(description)
      .should("be.visible")
      .type(random_project_dercription, { force: true });
    cy.get(final_create_btn)
      .should("be.visible")
      .should("contain", final_create_btn_text)
      .click();
    cy.wait("@newproject");
    cy.contains(random_project_name).should("be.visible");
    cy.contains(random_project_dercription).should("be.visible");
  });
  it("Editing a project", () => {
    // add negative assertions
    cy.intercept("/api/projects/*").as("project");
    cy.contains(edit_btn_text).click();
    cy.wait("@project");
    cy.get(name).clear().type(random_edit_project_name);
    cy.get(description).clear().type(random_edit_project_dercription);
    cy.get(update_btn)
      .should("be.visible")
      .should("contain", update_btn_text)
      .click();
    cy.contains(random_edit_project_name).should("be.visible");
    cy.contains(random_edit_project_dercription).should("be.visible");
  });
  it("Deleting a project", () => {
    cy.get(first_project + project_name)
      .invoke("text")

      .then((value) => {
        let first_project_name = value;

        cy.get(first_project + project_delete_btn).click();
        cy.contains(first_project_name).should("not.exist");
      });
  });
});
