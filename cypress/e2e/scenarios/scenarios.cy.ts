/// <reference types="cypress" />

describe("Scénarios E2E", () => {

  describe("Parcours complet : prise de rendez-vous", () => {
    const uid = Date.now();

    before(() => {
      // Vérification initiale de l'application
      cy.visit("/");
      cy.get(".sidebar").should("be.visible");
    });

    it("crée un nouveau patient", () => {
      cy.createPatient({
        nom: `Scenario-${uid}`,
        prenom: "Alice",
        email: `alice.scenario-${uid}@mail.fr`,
        telephone: "0678112233",
        dateNaissance: "1993-08-12",
        nss: "293087500123",
        adresse: "10 rue de Rivoli, 75001 Paris",
      });

      cy.checkFlash("success", "créé");
    });

    it("crée un nouveau médecin", () => {
      cy.createMedecin({
        nom: `DocScenario-${uid}`,
        prenom: "Marc",
        specialite: "Chirurgie",
        email: `dr.scenario-${uid}@cabinet.fr`,
        telephone: "0145001122",
        numeroOrdre: `SCEN-${uid}`,
      });

      cy.checkFlash("success", "ajouté");
    });

    it("crée un rendez-vous entre le patient et le médecin", () => {
      cy.visit("/rendezvous/new");

      // Sélectionner le dernier patient et médecin ajoutés
      cy.get("#rendez_vous_patient").then(($select) => {
        const lastVal = $select.find("option").last().val();
        cy.get("#rendez_vous_patient").select(String(lastVal));
      });
      cy.get("#rendez_vous_medecin").then(($select) => {
        const lastVal = $select.find("option").last().val();
        cy.get("#rendez_vous_medecin").select(String(lastVal));
      });

      const future = new Date();
      future.setDate(future.getDate() + 14);
      cy.get("#rendez_vous_dateHeure").type(future.toISOString().slice(0, 11) + "09:30");
      cy.get("#rendez_vous_dureeMinutes").select("45 min");
      cy.get("#rendez_vous_motif").type("Consultation pré-opératoire");
      cy.get("#rendez_vous_notes").type("Apporter résultats analyses sang");
      cy.get('button[type="submit"]').click();

      cy.checkFlash("success", "créé");
    });

    it("retrouve le rendez-vous dans la liste et vérifie son contenu", () => {
      cy.visit("/rendezvous");
      cy.contains("td", "Consultation pré-opératoire")
        .parents("tr").find('a[href*="/rendezvous/"]').first().click();

      cy.contains("Consultation pré-opératoire").should("be.visible");
      cy.contains("Apporter résultats analyses sang").should("be.visible");
      cy.get(".badge").should("contain.text", "En attente");
    });

    it("confirme puis termine le rendez-vous", () => {
      cy.visit("/rendezvous");
      cy.contains("td", "Consultation pré-opératoire")
        .parents("tr").find('a[href*="/rendezvous/"]').first().click();

      // Confirmer
      cy.contains("button", "Confirmer").click();
      cy.checkFlash("success", "Statut mis à jour");
      cy.get(".badge.bg-success").should("contain.text", "Confirmé");

      // Terminer
      cy.contains("button", "Terminé").click();
      cy.checkFlash("success", "Statut mis à jour");
      cy.get(".badge.bg-secondary").should("contain.text", "Terminé");
    });
  });

  describe("Session : navigation rapide avec cache", () => {
    it("établit une session et la réutilise pour accélérer les tests", () => {
      cy.session("medrdv-app", () => {
        cy.visit("/");
        cy.get(".sidebar").should("be.visible");
      });

      cy.visit("/patient");
      cy.get("h2").should("contain.text", "Patients");
    });

    it("réutilise la session existante sans refaire le setup", () => {
      cy.session("medrdv-app", () => {
        cy.visit("/");
        cy.get(".sidebar").should("be.visible");
      });

      cy.visit("/medecin");
      cy.get("h2").should("contain.text", "Médecins");
    });

    it("valide la session avec une fonction validate()", () => {
      cy.session(
        "medrdv-validated",
        () => {
          cy.visit("/");
          cy.get(".sidebar").should("be.visible");
        },
        {
          validate() {
            cy.visit("/");
            cy.get(".sidebar").should("be.visible");
          },
        }
      );

      cy.visit("/rendezvous");
      cy.get("h2").should("contain.text", "Rendez-vous");
    });
  });

  describe("Vérification de la cohérence des données", () => {
    it("vérifie que le compteur du dashboard correspond au nombre de patients", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").its("length").then((patientCount) => {
        cy.visit("/");
        cy.get(".stat-card").contains("Patients")
          .parents(".stat-card").find(".h4")
          .invoke("text").then((text) => {
            expect(parseInt(text)).to.eq(patientCount);
          });
      });
    });

    it("vérifie que le compteur du dashboard correspond au nombre de médecins", () => {
      cy.visit("/medecin");
      cy.get(".col-md-6 .card").its("length").then((medecinCount) => {
        cy.visit("/");
        cy.get(".stat-card").contains("Médecins")
          .parents(".stat-card").find(".h4")
          .invoke("text").then((text) => {
            expect(parseInt(text)).to.eq(medecinCount);
          });
      });
    });

    it("vérifie que l'historique patient contient bien ses RDV", () => {
      cy.visit("/patient");
      // Trouver Dupont (a des RDV dans les fixtures)
      cy.contains("td a", "Jean Dupont").click();

      // La section historique devrait contenir au moins un RDV
      cy.get(".col-lg-8 .card").within(() => {
        cy.get("table tbody tr").should("have.length.at.least", 1);
      });
    });
  });
});
