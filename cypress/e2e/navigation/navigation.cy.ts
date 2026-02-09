/// <reference types="cypress" />

describe("Navigation", () => {

  describe("Sidebar", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("affiche le logo et le nom de l'application", () => {
      cy.get(".sidebar-brand h4").should("be.visible").and("contain.text", "MedRDV");
      cy.get(".sidebar-brand small").should("contain.text", "Gestion des rendez-vous");
    });

    it("contient les 4 sections de navigation", () => {
      cy.get(".sidebar .nav-link").should("have.length", 4);
      cy.get(".sidebar").within(() => {
        cy.contains("Tableau de bord").should("exist");
        cy.contains("Patients").should("exist");
        cy.contains("Médecins").should("exist");
        cy.contains("Rendez-vous").should("exist");
      });
    });

    it("met en surbrillance la section active", () => {
      cy.get('.sidebar .nav-link[href="/"]').should("have.class", "active");

      cy.navigateTo("patients");
      cy.get(".sidebar .nav-link").contains("Patients").should("have.class", "active");
      cy.get(".sidebar .nav-link").contains("Tableau de bord").should("not.have.class", "active");
    });

    it("affiche les icônes Bootstrap Icons pour chaque lien", () => {
      cy.get(".sidebar .nav-link i.bi-speedometer2").should("exist");
      cy.get(".sidebar .nav-link i.bi-people").should("exist");
      cy.get(".sidebar .nav-link i.bi-person-badge").should("exist");
      cy.get(".sidebar .nav-link i.bi-calendar-check").should("exist");
    });
  });

  describe("Routing", () => {
    it("navigue vers chaque section et vérifie l'URL", () => {
      cy.visit("/");

      cy.navigateTo("patients");
      cy.url().should("include", "/patient");
      cy.get("h2").should("contain.text", "Patients");

      cy.navigateTo("medecins");
      cy.url().should("include", "/medecin");
      cy.get("h2").should("contain.text", "Médecins");

      cy.navigateTo("rendezvous");
      cy.url().should("include", "/rendezvous");
      cy.get("h2").should("contain.text", "Rendez-vous");

      cy.navigateTo("dashboard");
      cy.url().should("eq", Cypress.config("baseUrl") + "/");
    });

    it("intercepte les requêtes de navigation et vérifie le status 200", () => {
      cy.intercept("GET", "/patient*").as("patients");
      cy.intercept("GET", "/medecin*").as("medecins");
      cy.intercept("GET", "/rendezvous*").as("rdv");

      cy.visit("/patient");
      cy.wait("@patients").its("response.statusCode").should("eq", 200);

      cy.navigateTo("medecins");
      cy.wait("@medecins").its("response.statusCode").should("eq", 200);

      cy.navigateTo("rendezvous");
      cy.wait("@rdv").its("response.statusCode").should("eq", 200);
    });
  });

  describe("Breadcrumb", () => {
    it("affiche le fil d'Ariane sur la page de détail patient", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").first().find("a").first().click();

      cy.get(".breadcrumb").should("be.visible");
      cy.get(".breadcrumb-item").should("have.length.at.least", 2);
      cy.get(".breadcrumb-item a").contains("Patients").should("exist");
    });

    it("permet de revenir à la liste via le breadcrumb", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").first().find("a").first().click();

      cy.get(".breadcrumb-item a").contains("Patients").click();
      cy.url().should("include", "/patient");
      cy.get("h2").should("contain.text", "Patients");
    });
  });
});
