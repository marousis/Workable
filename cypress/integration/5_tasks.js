// Import packages to upload files & to preserve local storage
import "cypress-file-upload";
import "cypress-localstorage-commands";

// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const login_path = "login";
const login_btn = ".btn";
const email = "#email";
const password = "#password";
const add_task_btn =
  ":nth-child(1) > .row > .col > .card > .card-action > #btn_add_task";
const new_task_path = "createTask";
const tasks_path = "tasks";
const summary = "#summary";
const description = "#description";
const labels_selector = "#search_input";
const upload_file = "#attachments";
const create_btn = ".waves-effect";
const view_tasks =
  ":nth-child(1) > .row > .col > .card > .card-action > #btn_view_tasks";
const first_todo_item = "#to_do_items > :nth-child(1)";
const in_progress_column = "#in_progress_items";

//Data
const email_valid = "marousis@gmail.com";
const password_valid = "27021989";
const add_task_btn_text = "Add Task";
let random_task_summary = (Math.random() + 1).toString(36);
let random_task_dercription = (Math.random() + 1).toString(36);
const label = "backend";
const filepath = "data.pdf";

context("Task tests", () => {
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
  //   it("Creating a new task", () => {
  //     // add negative assertions
  //     cy.get(add_task_btn)
  //       .should("be.visible")
  //       .should("contain", add_task_btn_text)
  //       .click();
  //     cy.url().should("contain", new_task_path);
  //     cy.get(summary).type(random_task_summary, { force: true });
  //     cy.get(description).type(random_task_dercription, { force: true });
  //     cy.get(labels_selector).type(label, { force: true });
  //     cy.contains(label).click();
  //     cy.get(upload_file).attachFile(filepath);
  //     cy.get(create_btn).click();
  //     cy.url().should("contain", tasks_path);
  //   });
  it("Editing a task", () => {
    //edit
  });
  it("Deleting a task", () => {
    //delete
  });
});
