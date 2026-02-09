/// <reference types="cypress" />

describe("Patients", () => {

  describe("Liste", () => {
    beforeEach(() => {
      cy.visit("/patient");
    });

    it("affiche le titre et le compteur de patients", () => {
      cy.get("h2").should("contain.text", "Patients");
      cy.get("p.text-muted").invoke("text").should("match", /\d+ patient/);
    });

    it("affiche un tableau avec les colonnes attendues", () => {
      cy.get("table").should("be.visible");
      cy.get("table thead").within(() => {
        cy.contains("th", "Nom").should("exist");
        cy.contains("th", "Email").should("exist");
        cy.contains("th", "Téléphone").should("exist");
        cy.contains("th", "Naissance").should("exist");
        cy.contains("th", "N° SS").should("exist");
      });
    });

    it("affiche les patients chargés par les fixtures", () => {
      cy.fixture("patients").then((data) => {
        data.existants.forEach((p: { nom: string }) => {
          cy.get("table tbody").should("contain.text", p.nom);
        });
      });
    });

    it("affiche les boutons Voir et Modifier pour chaque patient", () => {
      cy.get("table tbody tr").first().within(() => {
        cy.get('a[href*="/patient/"]').should("have.length.at.least", 1);
        cy.get(".btn-outline-primary").should("exist");
        cy.get(".btn-outline-warning").should("exist");
      });
    });
  });

  describe("Création", () => {
    it("crée un patient et vérifie le flash message", () => {
      cy.fixture("patients").then((data) => {
        cy.createPatient(data.nouveau);

        cy.url().should("include", "/patient");
        cy.checkFlash("success", "créé");
        cy.get("table tbody").should("contain.text", data.nouveau.nom);
      });
    });

    it("intercepte le POST de création et vérifie les données envoyées", () => {
      cy.intercept("POST", "/patient/new").as("postPatient");

      cy.visit("/patient/new");
      cy.get("#patient_nom").type("Durand");
      cy.get("#patient_prenom").type("Pierre");
      cy.get("#patient_email").type("pierre.durand@mail.fr");
      cy.get("#patient_telephone").type("0612345678");
      cy.get("#patient_dateNaissance").type("1987-11-03");
      cy.get('button[type="submit"]').click();

      cy.wait("@postPatient").then((interception) => {
        expect(interception.request.method).to.eq("POST");
        expect(interception.request.body).to.include("Durand");
      });
    });

    it("reste sur le formulaire si les champs obligatoires sont vides", () => {
      cy.visit("/patient/new");
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/patient/new");
    });
  });

  describe("Fiche détaillée", () => {
    it("affiche toutes les informations du patient", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").first().find("a").first().click();
      cy.url().should("match", /\/patient\/\d+$/);

      cy.get("h4").should("not.be.empty");
      cy.contains("Email").should("be.visible");
      cy.contains("Tél").should("be.visible");
      cy.contains("Naissance").should("be.visible");
    });

    it("affiche la section historique des rendez-vous", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").first().find("a").first().click();

      cy.contains("Historique").should("be.visible");
      cy.get(".col-lg-8 .card").should("exist");
    });

    it("permet d'accéder au formulaire de modification", () => {
      cy.visit("/patient");
      cy.get("table tbody tr").first().find("a").first().click();

      cy.contains("a.btn", "Modifier").click();
      cy.url().should("include", "/edit");
      cy.get("#patient_nom").should("not.have.value", "");
    });
  });

  describe("Modification", () => {
    it("modifie le téléphone et l'adresse d'un patient", () => {
      cy.fixture("patients").then((data) => {
        cy.visit("/patient");
        cy.get("table tbody tr").first().find("a").first().click();
        cy.contains("a.btn", "Modifier").click();

        cy.get("#patient_telephone").clear().type(data.modification.telephone);
        cy.get("#patient_adresse").clear().type(data.modification.adresse);
        cy.get('button[type="submit"]').click();

        cy.checkFlash("success", "modifié");
        cy.contains(data.modification.telephone).should("be.visible");
      });
    });
  });

  describe("Suppression", () => {
    it("supprime un patient après confirmation du dialogue", () => {
      cy.fixture("patients").then((data) => {
        cy.createPatient(data.aSupprimer);

        cy.visit("/patient");
        cy.contains("td a", `${data.aSupprimer.prenom} ${data.aSupprimer.nom}`).click();

        cy.on("window:confirm", () => true);
        cy.get('form[action*="/delete"] button').click();

        cy.url().should("include", "/patient");
        cy.checkFlash("success", "supprimé");
      });
    });

    it("intercepte la requête POST de suppression avec le token CSRF", () => {
      cy.createPatient({
        nom: "InterceptDel",
        prenom: "Test",
        email: "intercept.del@test.fr",
        telephone: "0600099900",
        dateNaissance: "1990-06-15",
      });

      cy.visit("/patient");
      cy.contains("td a", "Test InterceptDel").click();

      cy.intercept("POST", "/patient/*/delete").as("deleteReq");
      cy.on("window:confirm", () => true);
      cy.get('form[action*="/delete"] button').click();

      cy.wait("@deleteReq").then((interception) => {
        expect(interception.request.body).to.include("_token");
      });
    });
  });

  describe("Recherche", () => {
    beforeEach(() => {
      cy.visit("/patient");
    });

    it("filtre les patients par nom via le champ de recherche", () => {
      cy.get('input[name="q"]').type("Dupont");
      cy.get('button[type="submit"]').contains("Rechercher").click();

      cy.url().should("include", "q=Dupont");
      cy.get("table tbody").should("contain.text", "Dupont");
      cy.get('input[name="q"]').should("have.value", "Dupont");
    });

    it("permet de soumettre la recherche avec la touche Entrée", () => {
      cy.get('input[name="q"]').type("Leroy{enter}");
      cy.url().should("include", "q=Leroy");
      cy.get("table tbody").should("contain.text", "Leroy");
    });

    it("affiche le bouton Effacer après une recherche", () => {
      cy.get('input[name="q"]').type("Dupont{enter}");
      cy.contains("a", "Effacer").should("be.visible").click();

      cy.url().should("not.include", "q=");
      cy.get("table tbody tr").should("have.length.at.least", 2);
    });
  });
});
