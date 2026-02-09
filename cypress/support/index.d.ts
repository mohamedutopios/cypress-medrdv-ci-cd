/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /** Crée un patient via le formulaire /patient/new */
    createPatient(patient: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      dateNaissance: string;
      nss?: string;
      adresse?: string;
    }): Chainable<void>;

    /** Crée un médecin via le formulaire /medecin/new */
    createMedecin(medecin: {
      nom: string;
      prenom: string;
      specialite: string;
      email: string;
      telephone: string;
      numeroOrdre?: string;
      adresseCabinet?: string;
      honoraires?: string;
    }): Chainable<void>;

    /** Crée un rendez-vous via le formulaire /rendezvous/new */
    createRendezVous(rdv: {
      patientIndex: number;
      medecinIndex: number;
      dateHeure: string;
      duree: string;
      motif?: string;
      notes?: string;
    }): Chainable<void>;

    /** Navigue vers une section via la sidebar */
    navigateTo(section: "dashboard" | "patients" | "medecins" | "rendezvous"): Chainable<void>;

    /** Vérifie qu'un flash message Bootstrap s'affiche */
    checkFlash(type: string, text: string): Chainable<void>;
  }
}
