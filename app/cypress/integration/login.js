describe("Sign in", () => {
    it("Doesn't log in", () => {
        cy.visit("/");
        cy.get("[data-test-id=auth-input-username]").type("bad@email.com");
        cy.get("[data-test-id=auth-input-password").type("bad-password");
        cy.get("[data-test=component-button").click();
    });
    it("Signs in with valid credentials", () => {
        // // cy.visit("http://localhost:3000/");
        cy.visit("/");
        // cy.get(".sign-in-btn").click();
        // cy.get(".email").type("testuser@skorz.co.uk");
        // cy.get(".password").type("testtest123");
        // cy.get(".sign-in-btn").click();
        // // cy.wait(3000);
        // cy.get(".logo", { timeout: 3000 }).should("be.visible");
    });
});