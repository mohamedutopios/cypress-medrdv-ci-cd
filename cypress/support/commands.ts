/// <reference path="./index.d.ts" />

Cypress.Commands.add("createPatient", (patient) => {
  cy.visit("/patient/new");
  cy.get("#patient_nom").clear().type(patient.nom);
  cy.get("#patient_prenom").clear().type(patient.prenom);
  cy.get("#patient_email").clear().type(patient.email);
  cy.get("#patient_telephone").clear().type(patient.telephone);
  cy.get("#patient_dateNaissance").clear().type(patient.dateNaissance);
  if (patient.nss) {
    cy.get("#patient_numeroSecuriteSociale").clear().type(patient.nss);
  }
  if (patient.adresse) {
    cy.get("#patient_adresse").clear().type(patient.adresse);
  }
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("createMedecin", (medecin) => {
  cy.visit("/medecin/new");
  cy.get("#medecin_nom").clear().type(medecin.nom);
  cy.get("#medecin_prenom").clear().type(medecin.prenom);
  cy.get("#medecin_specialite").select(medecin.specialite);
  cy.get("#medecin_email").clear().type(medecin.email);
  cy.get("#medecin_telephone").clear().type(medecin.telephone);
  if (medecin.numeroOrdre) {
    cy.get("#medecin_numeroOrdre").clear().type(medecin.numeroOrdre);
  }
  if (medecin.adresseCabinet) {
    cy.get("#medecin_adresseCabinet").clear().type(medecin.adresseCabinet);
  }
  if (medecin.honoraires) {
    cy.get("#medecin_honoraires").clear().type(medecin.honoraires);
  }
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("createRendezVous", (rdv) => {
  cy.visit("/rendezvous/new");
  cy.get("#rendez_vous_patient").select(rdv.patientIndex);
  cy.get("#rendez_vous_medecin").select(rdv.medecinIndex);
  cy.get("#rendez_vous_dateHeure").clear().type(rdv.dateHeure);
  cy.get("#rendez_vous_dureeMinutes").select(rdv.duree);
  if (rdv.motif) {
    cy.get("#rendez_vous_motif").clear().type(rdv.motif);
  }
  if (rdv.notes) {
    cy.get("#rendez_vous_notes").clear().type(rdv.notes);
  }
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("navigateTo", (section) => {
  const labels: Record<string, string> = {
    dashboard: "Tableau de bord",
    patients: "Patients",
    medecins: "Médecins",
    rendezvous: "Rendez-vous",
  };
  cy.get(".sidebar .nav-link").contains(labels[section]).click();
});

Cypress.Commands.add("checkFlash", (type, text) => {
  cy.get(`.alert-${type}`).should("be.visible").and("contain.text", text);
});
