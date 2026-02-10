/// <reference types="cypress" />

describe("Médecins", () => {

  // ===========================================================================
  // LISTE DES MÉDECINS
  // ===========================================================================
  describe("Liste", () => {

    beforeEach(() => {
      cy.step("Ouverture de la page liste des médecins");
      cy.visit("/medecin");
    });

    it("Affiche les médecins sous forme de cartes", () => {
      cy.step("Vérification du titre de la page");
      cy.get("h2").should("contain.text", "Médecins");

      cy.step("Vérification de la présence d’au moins un médecin");
      cy.get(".col-md-6 .card").should("have.length.at.least", 1);

      // 📸 Preuve visuelle : liste des médecins
      cy.screenshot("medecins-liste");

      cy.step("Vérification du contenu d’une carte médecin");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.get("h5").invoke("text").should("include", "Dr.");
        cy.get(".badge").should("exist");
        cy.contains("Détails").should("exist");
      });
    });

    it("Affiche les informations de contact de chaque médecin", () => {
      cy.step("Vérification des icônes de contact");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.get("i.bi-envelope").should("exist");
        cy.get("i.bi-telephone").should("exist");
      });
    });
  });

  // ===========================================================================
  // CRÉATION D’UN MÉDECIN
  // ===========================================================================
  describe("Création", () => {

    it("Crée un médecin avec toutes les informations", () => {
      cy.fixture("medecins").then((data) => {

        cy.step("Création d’un nouveau médecin via le formulaire");
        cy.createMedecin(data.nouveau);

        cy.step("Redirection vers la liste des médecins");
        cy.url().should("include", "/medecin");

        cy.step("Affichage du message de succès");
        cy.checkFlash("success", "ajouté");

        // 📸 Preuve visuelle : médecin créé
        cy.screenshot("medecin-cree-succes");

        cy.step("Vérification de la présence du médecin créé");
        cy.contains(`Dr. ${data.nouveau.prenom} ${data.nouveau.nom}`)
          .should("be.visible");
      });
    });

    it("Propose toutes les spécialités dans le select", () => {
      cy.step("Ouverture du formulaire de création");
      cy.visit("/medecin/new");

      cy.fixture("medecins").then((data) => {
        cy.step("Vérification des spécialités disponibles");
        data.specialites.forEach((spec: string) => {
          cy.get("#medecin_specialite option")
            .contains(spec)
            .should("exist");
        });
      });
    });
  });

  // ===========================================================================
  // FICHE DÉTAILLÉE
  // ===========================================================================
  describe("Fiche détaillée", () => {

    it("Affiche la fiche avec spécialité, contact et planning", () => {
      cy.step("Ouverture de la liste des médecins");
      cy.visit("/medecin");

      cy.step("Accès à la fiche détaillée");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.contains("Détails").click();
      });

      cy.step("Vérification de l’URL de la fiche");
      cy.url().should("match", /\/medecin\/\d+$/);

      // 📸 Preuve visuelle : fiche médecin
      cy.screenshot("medecin-fiche-detaillee");

      cy.step("Vérification des informations affichées");
      cy.get("h4").invoke("text").should("include", "Dr.");
      cy.get(".badge.bg-primary").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Planning").should("be.visible");
    });
  });

  // ===========================================================================
  // MODIFICATION
  // ===========================================================================
  describe("Modification", () => {

    it("Modifie le numéro de téléphone d’un médecin", () => {
      cy.step("Ouverture de la liste des médecins");
      cy.visit("/medecin");

      cy.step("Accès à la fiche du médecin");
      cy.get(".col-md-6 .card").first().within(() => {
        cy.contains("Détails").click();
      });

      cy.step("Accès au formulaire de modification");
      cy.contains("a.btn", "Modifier").click();
      cy.url().should("include", "/edit");

      // 📸 Avant modification
      cy.screenshot("medecin-edit-avant-submit");

      cy.step("Modification du numéro de téléphone");
      cy.get("#medecin_telephone")
        .clear()
        .type("0199887766");

      cy.step("Validation du formulaire");
      cy.get('button[type="submit"]').click();

      cy.step("Affichage du message de succès");
      cy.checkFlash("success", "modifié");

      // 📸 Après modification
      cy.screenshot("medecin-edit-succes");
    });
  });

  // ===========================================================================
  // SUPPRESSION
  // ===========================================================================
  describe("Suppression", () => {

    it("Supprime un médecin après confirmation", () => {
      cy.fixture("medecins").then((data) => {

        cy.step("Création d’un médecin à supprimer");
        cy.createMedecin(data.aSupprimer);

        cy.step("Ouverture de la liste des médecins");
        cy.visit("/medecin");

        cy.step("Accès à la fiche du médecin à supprimer");
        cy.contains(`Dr. ${data.aSupprimer.prenom} ${data.aSupprimer.nom}`)
          .parents(".card")
          .within(() => {
            cy.contains("Détails").click();
          });

        // 📸 Avant suppression
        cy.screenshot("medecin-avant-suppression");

        cy.step("Confirmation de la suppression");
        cy.on("window:confirm", () => true);
        cy.get('form[action*="/delete"] button').click();

        cy.step("Affichage du message de succès");
        cy.checkFlash("success", "supprimé");

        // 📸 Après suppression
        cy.screenshot("medecin-supprime-succes");
      });
    });
  });

  // ===========================================================================
  // FILTRE PAR SPÉCIALITÉ
  // ===========================================================================
  describe("Filtre par spécialité", () => {

    beforeEach(() => {
      cy.step("Ouverture de la page liste des médecins");
      cy.visit("/medecin");
    });

    it("Affiche les boutons de filtre avec 'Tous' actif par défaut", () => {
      cy.step("Vérification de la zone de filtres");
      cy.contains("Filtrer").should("be.visible");
      cy.get("a.btn")
        .contains("Tous")
        .should("have.class", "btn-primary");
    });

    it("Filtre les médecins par spécialité sélectionnée", () => {
      cy.step("Application du filtre Médecine générale");
      cy.get("a.btn").contains("Médecine générale").click();

      cy.url().should("include", "specialite=");

      // 📸 Liste filtrée
      cy.screenshot("medecins-filtre-medecine-generale");

      cy.step("Vérification des badges de spécialité");
      cy.get(".col-md-6 .card .badge").each(($badge) => {
        cy.wrap($badge).should("contain.text", "Médecine générale");
      });
    });

    it("Réaffiche tous les médecins en cliquant sur 'Tous'", () => {
      cy.step("Application d’un filtre");
      cy.get("a.btn").contains("Cardiologie").click();

      cy.step("Retour à l’affichage complet");
      cy.get("a.btn").contains("Tous").click();

      cy.url().should("not.include", "specialite=");
      cy.get(".col-md-6 .card").should("have.length.at.least", 2);
    });
  });

});
