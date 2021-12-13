// Locators
const base_url = "https://node-fs-app.herokuapp.com/";
const app_logo = "#app-logo";
const image_centered = "img";
const text_centered_locator = ".card-content>p";
const login_link = "#login";
const signup_link = "#signup";

// Data
const app_logo_text = "PMTool";
const alt_text = "Logo";
const centered_text =
  "Welcome to PPM tool. Signup for free, or login if you already have an account";
const login_text = "Login";
const login_href = "/login";
const signup_text = "Sign Up";
const signup_href = "/signup";

context("Validate landing page", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit(base_url);
  });
  it("Validate landing page url", () => {
    cy.url().should("eq", base_url);
    cy.get(app_logo).contains(app_logo_text).should("be.visible");
  });
  it("Validate landing page img", () => {
    cy.get(image_centered)
      .invoke("attr", "alt")
      .then((alt) => {
        expect(alt).to.equal(alt_text);
      });
  });
  it("Validate central text", () => {
    cy.get(text_centered_locator).contains(centered_text).should("be.visible");
  });
  it("Validate Login link", () => {
    cy.get(login_link)
      .contains(login_text)
      .should("be.visible")
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.equal(login_href);
      });
  });
  it("Validate Sign Up link", () => {
    cy.get(signup_link)
      .contains(signup_text)
      .should("be.visible")
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.equal(signup_href);
      });
  });
});
