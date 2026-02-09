/// <reference types="cypress" />

describe("Tableau de bord", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("affiche le titre et le sous-titre de la page", () => {
    cy.get("h2").should("contain.text", "Tableau de bord");
    cy.get("p.text-muted").should("contain.text", "Vue d'ensemble");
  });

  it("affiche 4 cartes de statistiques avec des valeurs numériques", () => {
    cy.get(".stat-card").should("have.length", 4);

    cy.get(".stat-card").each(($card) => {
      cy.wrap($card).find(".h4").invoke("text").should("match", /^\d+$/);
    });
  });

  it("affiche les compteurs Patients, Médecins, RDV aujourd'hui et à venir", () => {
    ["Patients", "Médecins", "RDV aujourd'hui", "RDV à venir"].forEach((label) => {
      cy.get(".stat-card").contains(label).should("be.visible");
    });
  });

  it("affiche la section des rendez-vous du jour", () => {
    cy.get(".card-header").contains("RDV du jour").should("be.visible");
    cy.get(".col-lg-8 .card").within(() => {
      cy.get("table, .text-muted").should("exist");
    });
  });

  it("affiche la section des prochains rendez-vous", () => {
    cy.get(".card-header").contains("Prochains RDV").should("be.visible");
    cy.get(".col-lg-4 .card").should("exist");
  });

  it("redirige vers la création de RDV via le bouton Nouveau RDV", () => {
    cy.get("a.btn-primary").contains("Nouveau RDV").click();
    cy.url().should("include", "/rendezvous/new");
  });

  it("retourne un status 200 avec le bon content-type", () => {
    cy.intercept("GET", "/").as("dashboard");
    cy.visit("/");
    cy.wait("@dashboard").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.headers["content-type"]).to.include("text/html");
    });
  });
});
