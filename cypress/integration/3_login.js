// Import packages to preserve local storage
import "cypress-localstorage-commands";
// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const login_path = "login";
const login_btn = ".btn";
const success_path = "dashboard";
const email = "#email";
const password = "#password";
const logout = "#logout";
const dashboard = "#dashboard";
const task_db = "#task_db";
const settings = "#settings";
const card_title = ".card-title";
const card_paragraph = ".card-content > p";
const create_btn = ".waves-effect";
const app_logo = "#app-logo";
const fullName = "#fullName";
const company = "#company";
const address = "#address";
const update_info_btn = "#update_info";

// Data
const error_message = "Invalid login info";
const invalid_email = "mail@invalid.com";
const invalid_password = "invalidpassword";
const name = "marousis";
const email_valid = "test_login@gmail.com";
const password_valid = "27021989";
const company_text = "mCompany";
const logout_text = "Logout";
const dashboard_text = "Dashboard";
const task_db_text = "TaskDB";
const settings_text = "Settings";
const card_title_text = "Welcome!";
const card_paragraph_text =
  "There are no projects created yet. Start by creating some!";
const create_btn_text = "Create";
const app_logo_text = "PMTool";
const create_href = "/createProject";
let random_address = (Math.random() + 1).toString(36);
const update_info_btn_text = "Update info";
const update_success = "User info updated successfully!";

//Loop lists
var loggedin_fields = [
  { locator: app_logo, value_expected: app_logo_text },
  { locator: logout, value_expected: logout_text },
  { locator: dashboard, value_expected: dashboard_text },
  { locator: task_db, value_expected: task_db_text },
  { locator: settings, value_expected: settings_text },
  { locator: card_title, value_expected: card_title_text },
  { locator: card_paragraph, value_expected: card_paragraph_text },
];
var settings_fields = [
  { locator: fullName, value_expected: name },
  { locator: email, value_expected: email_valid },
  { locator: company, value_expected: company_text },
];

context("Signing up Test", () => {
  before(() => {
    // Before starting the suite clear any local storage snapshots created
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    // Before eatch test restore the local storage in order to run the test
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    // After eatch test preserve the local storage for the next test
    cy.saveLocalStorage();
  });
  it("Validate landing page url", () => {
    cy.visit(base_url + login_path);
    cy.url().should("eq", base_url + login_path);
  });
  it("Validate landing page url", () => {
    cy.get(login_btn).should("be.visible").click();
    Array.from({ length: 2 }, (x, i) => {
      i = i + 1;
      cy.get(`:nth-child(${i}) > .input-field > .material-icons`).should(
        "be.visible"
      );
      cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
        .should("be.visible")
        .should("contain", error_message);
    });
  });
  it("Validate messages after unsuccessful login attempt", () => {
    cy.get(email).type(invalid_email, { force: true });
    cy.get(password).type(password_valid, { force: true });
    cy.get(login_btn).click();
    Array.from({ length: 2 }, (x, i) => {
      i = i + 1;
      cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
        .should("be.visible")
        .should("contain", error_message);
    });
    cy.get(email).clear().type(email_valid, { force: true });
    cy.get(password).clear().type(invalid_password, { force: true });
    cy.get(login_btn).click();
    Array.from({ length: 2 }, (x, i) => {
      i = i + 1;
      cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
        .should("be.visible")
        .should("contain", error_message);
    });
  });
  it("Validate successful login and user data", () => {
    cy.intercept("/api/currentUser").as("user");
    cy.get(email).clear().type(email_valid, { force: true });
    cy.get(password).clear().type(password_valid, { force: true });
    cy.get(login_btn).click();
    loggedin_fields.forEach(async function (field) {
      cy.get(field.locator)
        .should("be.visible")
        .should("contain", field.value_expected);
    });
    cy.get(create_btn)
      .should("be.visible")
      .should("contain", create_btn_text)
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.equal(create_href);
      });
    cy.get(settings).click();
    cy.wait("@user");
    settings_fields.forEach(async function (field) {
      cy.get(field.locator)
        .should("be.visible")
        .invoke("attr", "value")
        .then((value) => {
          expect(value).to.equal(field.value_expected);
        });
    });
  });
  it("Validate successful Address change", () => {
    cy.intercept("/api/currentUser").as("user");
    cy.get(address)
      .should("be.visible")
      .clear()
      .type(random_address, { force: true });
    cy.get(update_info_btn)
      .should("be.visible")
      .should("contain", update_info_btn_text)
      .click();
    cy.contains(update_success).should("be.visible");
    cy.get(settings).click();
    cy.wait("@user");
    cy.wait(1000); // Unfortunately UI doesn't render the API values fast enough!
    cy.get(address)
      .should("be.visible")
      .invoke("attr", "value")
      .then((value) => {
        expect(value).to.equal(random_address);
      });
  });
});
