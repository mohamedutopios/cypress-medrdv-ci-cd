/// <reference types="cypress" />

describe("Médecins", () => {

  describe("Liste", () => {
    beforeEach(() => {
      cy.visit("/medecin");
    });

    it("affiche les médecins sous forme de cartes", () => {
      cy.get("h2").should("contain.text", "Médecins");
      cy.get(".col-md-6 .card").should("have.length.at.least", 1);

      cy.get(".col-md-6 .card").first().within(() => {
        cy.get("h5").invoke("text").should("include", "Dr.");
        cy.get(".badge").should("exist");
        cy.contains("Détails").should("exist");
      });
    });

    it("affiche les informations de contact de chaque médecin", () => {
      cy.get(".col-md-6 .card").first().within(() => {
        cy.get("i.bi-envelope").should("exist");
        cy.get("i.bi-telephone").should("exist");
      });
    });
  });

  describe("Création", () => {
    it("crée un médecin avec toutes les informations", () => {
      cy.fixture("medecins").then((data) => {
        cy.createMedecin(data.nouveau);

        cy.url().should("include", "/medecin");
        cy.checkFlash("success", "ajouté");
        cy.contains(`Dr. ${data.nouveau.prenom} ${data.nouveau.nom}`).should("be.visible");
      });
    });

    it("propose toutes les spécialités dans le select", () => {
      cy.visit("/medecin/new");
      cy.fixture("medecins").then((data) => {
        data.specialites.forEach((spec: string) => {
          cy.get("#medecin_specialite option").contains(spec).should("exist");
        });
      });
    });
  });

  describe("Fiche détaillée", () => {
    it("affiche la fiche avec spécialité, contact et planning", () => {
      cy.visit("/medecin");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.contains("Détails").click();
      });

      cy.url().should("match", /\/medecin\/\d+$/);
      cy.get("h4").invoke("text").should("include", "Dr.");
      cy.get(".badge.bg-primary").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Planning").should("be.visible");
    });
  });

  describe("Modification", () => {
    it("modifie le numéro de téléphone d'un médecin", () => {
      cy.visit("/medecin");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.contains("Détails").click();
      });

      cy.contains("a.btn", "Modifier").click();
      cy.url().should("include", "/edit");

      cy.get("#medecin_telephone").clear().type("0199887766");
      cy.get('button[type="submit"]').click();

      cy.checkFlash("success", "modifié");
    });
  });

  describe("Suppression", () => {
    it("supprime un médecin après confirmation", () => {
      cy.fixture("medecins").then((data) => {
        cy.createMedecin(data.aSupprimer);

        cy.visit("/medecin");
        cy.contains(`Dr. ${data.aSupprimer.prenom} ${data.aSupprimer.nom}`)
          .parents(".card")
          .within(() => {
            cy.contains("Détails").click();
          });

        cy.on("window:confirm", () => true);
        cy.get('form[action*="/delete"] button').click();

        cy.checkFlash("success", "supprimé");
      });
    });
  });

  describe("Filtre par spécialité", () => {
    beforeEach(() => {
      cy.visit("/medecin");
    });

    it("affiche les boutons de filtre avec Tous actif par défaut", () => {
      cy.contains("Filtrer").should("be.visible");
      cy.get("a.btn").contains("Tous").should("have.class", "btn-primary");
    });

    it("filtre les médecins par spécialité sélectionnée", () => {
      cy.get("a.btn").contains("Médecine générale").click();
      cy.url().should("include", "specialite=");

      cy.get(".col-md-6 .card .badge").each(($badge) => {
        cy.wrap($badge).should("contain.text", "Médecine générale");
      });
    });

    it("réaffiche tous les médecins en cliquant sur Tous", () => {
      cy.get("a.btn").contains("Cardiologie").click();
      cy.get("a.btn").contains("Tous").click();

      cy.url().should("not.include", "specialite=");
      cy.get(".col-md-6 .card").should("have.length.at.least", 2);
    });
  });
});
