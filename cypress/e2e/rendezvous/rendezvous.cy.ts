/// <reference types="cypress" />

describe("Rendez-vous", () => {

  describe("Liste", () => {
    beforeEach(() => {
      cy.visit("/rendezvous");
    });

    it("affiche la liste des rendez-vous dans un tableau", () => {
      cy.get("h2").should("contain.text", "Rendez-vous");
      cy.get("table").should("be.visible");
      cy.get("table thead th").should("have.length.at.least", 7);
    });

    it("affiche un badge de statut sur chaque ligne", () => {
      cy.get("table tbody tr").first().find(".badge").should("exist");
    });

    it("affiche les liens Patient et Médecin cliquables", () => {
      cy.get("table tbody tr").first().within(() => {
        cy.get('a[href*="/patient/"]').should("exist");
        cy.get('a[href*="/medecin/"]').should("exist");
      });
    });
  });

  describe("Création", () => {
    it("crée un rendez-vous avec patient, médecin, date et motif", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const dateStr = future.toISOString().slice(0, 11) + "10:00";

      cy.createRendezVous({
        patientIndex: 1,
        medecinIndex: 1,
        dateHeure: dateStr,
        duree: "30 min",
        motif: "Consultation de contrôle",
        notes: "Patient régulier",
      });

      cy.url().should("include", "/rendezvous");
      cy.checkFlash("success", "créé");
    });

    it("propose les patients et médecins dans les selects", () => {
      cy.visit("/rendezvous/new");

      cy.get("#rendez_vous_patient option").should("have.length.at.least", 2);
      cy.get("#rendez_vous_patient option").contains("Dupont").should("exist");

      cy.get("#rendez_vous_medecin option").should("have.length.at.least", 2);
      cy.get("#rendez_vous_medecin option").contains("Dr.").should("exist");

      cy.get("#rendez_vous_dureeMinutes option").should("have.length", 6);
    });

    it("intercepte le POST de création du rendez-vous", () => {
      cy.intercept("POST", "/rendezvous/new").as("postRdv");

      cy.visit("/rendezvous/new");
      cy.get("#rendez_vous_patient").select(1);
      cy.get("#rendez_vous_medecin").select(1);

      const future = new Date();
      future.setDate(future.getDate() + 8);
      cy.get("#rendez_vous_dateHeure").type(future.toISOString().slice(0, 11) + "11:00");
      cy.get("#rendez_vous_dureeMinutes").select("45 min");
      cy.get("#rendez_vous_motif").type("Test intercept création");
      cy.get('button[type="submit"]').click();

      cy.wait("@postRdv").then((interception) => {
        expect(interception.request.method).to.eq("POST");
        expect(interception.response?.statusCode).to.be.oneOf([200, 302]);
      });
    });
  });

  describe("Fiche détaillée", () => {
    it("affiche les informations complètes du rendez-vous", () => {
      cy.visit("/rendezvous");
      cy.get("table tbody tr").first().find('a[href*="/rendezvous/"]').first().click();

      cy.url().should("match", /\/rendezvous\/\d+$/);
      cy.get("h4").should("contain.text", "RDV #");
      cy.contains("Patient").should("be.visible");
      cy.contains("Médecin").should("be.visible");
      cy.contains("Informations").should("be.visible");
      cy.contains("Actions").should("be.visible");
    });

    it("affiche les liens vers les fiches patient et médecin", () => {
      cy.visit("/rendezvous");
      cy.get("table tbody tr").first().find('a[href*="/rendezvous/"]').first().click();

      cy.get('a[href*="/patient/"]').should("exist");
      cy.get('a[href*="/medecin/"]').should("exist");
    });
  });

  describe("Modification", () => {
    it("modifie le motif d'un rendez-vous", () => {
      cy.visit("/rendezvous");
      cy.get("table tbody tr").first().find('a[href*="/rendezvous/"]').first().click();

      cy.contains("a.btn", "Modifier").click();
      cy.url().should("include", "/edit");

      cy.get("#rendez_vous_motif").clear().type("Motif mis à jour");
      cy.get('button[type="submit"]').click();

      cy.checkFlash("success", "modifié");
      cy.contains("Motif mis à jour").should("be.visible");
    });
  });

  describe("Gestion des statuts", () => {
    it("affiche les boutons Confirmer et Annuler pour un RDV en attente", () => {
      cy.visit("/rendezvous");
      cy.get("table tbody tr").contains(".badge", "En attente")
        .parents("tr").find('a[href*="/rendezvous/"]').first().click();

      cy.contains("button", "Confirmer").should("be.visible");
      cy.contains("button", "Annuler").should("be.visible");
    });

    it("confirme un rendez-vous en attente", () => {
      cy.visit("/rendezvous");
      cy.get("table tbody tr").contains(".badge", "En attente")
        .parents("tr").find('a[href*="/rendezvous/"]').first().click();

      cy.contains("button", "Confirmer").click();
      cy.checkFlash("success", "Statut mis à jour");
      cy.get(".badge.bg-success").should("contain.text", "Confirmé");
    });

    it("annule un rendez-vous", () => {
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const dateStr = future.toISOString().slice(0, 11) + "16:00";

      cy.createRendezVous({
        patientIndex: 1,
        medecinIndex: 1,
        dateHeure: dateStr,
        duree: "30 min",
        motif: "RDV pour annulation",
      });

      cy.visit("/rendezvous");
      cy.contains("td", "RDV pour annulation")
        .parents("tr").find('a[href*="/rendezvous/"]').first().click();

      cy.contains("button", "Annuler").click();
      cy.checkFlash("success", "Statut mis à jour");
      cy.get(".badge.bg-danger").should("contain.text", "Annulé");
    });
  });

  describe("Filtre par statut", () => {
    beforeEach(() => {
      cy.visit("/rendezvous");
    });

    it("affiche les 5 boutons de filtre de statut", () => {
      ["Tous", "En attente", "Confirmés", "Annulés", "Terminés"].forEach((f) => {
        cy.get("a.btn").contains(f).should("be.visible");
      });
    });

    it("filtre les RDV en attente", () => {
      cy.get("a.btn").contains("En attente").click();
      cy.url().should("include", "statut=en_attente");

      cy.get("table tbody .badge").each(($badge) => {
        cy.wrap($badge).should("contain.text", "En attente").and("have.class", "bg-warning");
      });
    });

    it("filtre les RDV terminés", () => {
      cy.get("a.btn").contains("Terminés").click();
      cy.url().should("include", "statut=termine");

      cy.get("table tbody .badge").each(($badge) => {
        cy.wrap($badge).should("contain.text", "Terminé").and("have.class", "bg-secondary");
      });
    });

    it("vérifie la correspondance entre les statuts et les classes CSS des badges", () => {
      cy.fixture("rendezvous").then((data) => {
        cy.get("table tbody .badge").first().then(($badge) => {
          const text = $badge.text().trim();
          const expectedClass = data.badges[text];
          if (expectedClass) {
            cy.wrap($badge).should("have.class", expectedClass);
          }
        });
      });
    });
  });
});
