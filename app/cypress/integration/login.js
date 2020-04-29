describe("Sign in", () => {
    it("Doesn't log in", () => {
        // // cy.visit("http://localhost:3000/");
        // cy.visit("/");
        // cy.get(".sign-in-btn").click();
        // cy.get(".email").type("bad@email.com");
        // cy.get(".password").type("bad-password");
        // cy.get(".sign-in-btn").click();
        // cy.get(".message-heading").contains("Login failed");
    });
    it("Signs in with valid credentials", () => {
        // // cy.visit("http://localhost:3000/");
        cy.visit("/");
        cy.get(".sign-in-btn").click();
        // cy.get(".email").type("testuser@skorz.co.uk");
        // cy.get(".password").type("testtest123");
        // cy.get(".sign-in-btn").click();
        // // cy.wait(3000); // poo
        // cy.get(".logo", { timeout: 3000 }).should("be.visible");
    });
});