// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const signup_path = "signup";
const name = "#fullName";
const email = "#email";
const password = "#password";
const company = "#company";
const address = "#address";
const submit_btn = ".btn";
const success_path = "verifyAccount";
const success_card_title = ".card-title";
const success_card_paragraph = ".card-content>p";

// Data
const error_message = "This field is required";
const error_existing_mail = "Email `test_login@gmail.com` already exits";
const error_invalid_mail_format = "Invalid email format";
const inputs_index = [name, email, password, company, address];
let random_username = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "");
let username_to_submit = random_username;
let random_mail = random_username + "@gmail.com";
const existing_mail = "test_login@gmail.com";
let invalid_mail_format = random_username + "#gmail.com";
let email_to_submit = random_mail;
let random_password = Math.random();
let password_to_submit = random_password;
const company_to_submit = "m Company";
const address_to_submit = "Pinelopis Delta 32, 11525, Athens";
const success_card_title_text = "Verify your account";
const success_card_paragraph_text =
  "Successfull registration, login to start using PPMTool";

//Loop list
var fields = [
  { locator: name, value: username_to_submit },
  { locator: email, value: email_to_submit },
  { locator: password, value: password_to_submit },
  { locator: company, value: company_to_submit },
  { locator: address, value: address_to_submit },
];

context("Signing up Test", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it("Validate landing page url", () => {
    cy.visit(base_url + signup_path);
    cy.url().should("eq", base_url + signup_path);
  });
  it("Validate landing page elements", () => {
    cy.get(submit_btn).should("be.visible").click();
    Array.from({ length: 5 }, (x, i) => {
      i = i + 1;
      cy.get(`:nth-child(${i}) > .input-field > .material-icons`).should(
        "be.visible"
      );
      if (i < 4) {
        cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
          .should("be.visible")
          .should("contain", error_message);
      }
    });
    inputs_index.forEach((input) => {
      cy.get(input).should("be.visible");
    });
  });
  it("Validate Username", () => {
    cy.get(name)
      .invoke("attr", "type")
      .then((type) => {
        expect(type).to.equal("text");
      });
    cy.get(name).type(username_to_submit, { force: true });
    cy.get(submit_btn).click();
    Array.from({ length: 2 }, (x, i) => {
      i = i + 2;
      cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
        .should("be.visible")
        .should("contain", error_message);
    });
  });
  it("Validate Existing Email", () => {
    cy.get(email)
      .invoke("attr", "type")
      .then((type) => {
        expect(type).to.equal("text");
      });
    cy.get(submit_btn).click();
    cy.get(":nth-child(2) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_message);
    cy.get(email).type(existing_mail, { force: true });
    cy.get(submit_btn).click();
    cy.get(":nth-child(2) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_existing_mail);
    cy.get(":nth-child(3) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_message);
  });
  it("Validate Email Format", () => {
    cy.get(email).clear().type(invalid_mail_format, { force: true });
    cy.get(submit_btn).click();
    cy.get(":nth-child(2) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_invalid_mail_format);
    cy.get(":nth-child(3) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_message);
  });
  it("Validate Email", () => {
    cy.get(email).type(email_to_submit, { force: true });
    cy.get(submit_btn).click();
    cy.get(":nth-child(2) > .input-field > .invalid-feedback").should(
      "not.be.visible"
    );
    cy.get(":nth-child(3) > .input-field > .invalid-feedback")
      .should("be.visible")
      .should("contain", error_message);
  });
  it("Validate Password", () => {
    cy.get(name).clear();
    cy.get(email).clear();
    cy.get(password)
      .invoke("attr", "type")
      .then((type) => {
        expect(type).to.equal("password");
      });
    cy.get(password).type(password_to_submit, { force: true });
    cy.get(submit_btn).click();
    Array.from({ length: 2 }, (x, i) => {
      i = i + 1;
      cy.get(`:nth-child(${i}) > .input-field > .invalid-feedback`)
        .should("be.visible")
        .should("contain", error_message);
    });
  });
  it("Sumbit form", () => {
    inputs_index.forEach((input) => {
      cy.get(input).clear;
    });
    fields.forEach(async function (field) {
      cy.get(field.locator).type(field.value, { force: true });
    });
    cy.get(submit_btn).click();
  });
  it("Validate Success page", () => {
    cy.url().should("eq", base_url + success_path);
    cy.get(success_card_title)
      .contains(success_card_title_text)
      .should("be.visible");
    cy.get(success_card_paragraph)
      .contains(success_card_paragraph_text)
      .should("be.visible");
  });
});
