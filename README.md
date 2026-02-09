# 🏥 MedRDV - Application de gestion de rendez-vous médicaux

Application Symfony 6.4 avec suite de tests E2E Cypress (68 tests en TypeScript).

---

## 📋 Prérequis

| Outil | Version |
|-------|---------|
| **PHP** | ≥ 8.2 |
| **Composer** | ≥ 2 |
| **Symfony CLI** | dernière version |
| **Docker** | ≥ 20 |
| **Docker Compose** | ≥ 2 |
| **Node.js** | ≥ 18 |
| **npm** | ≥ 9 |

---

## 🚀 Installation

```bash
cd medrdv
chmod +x install.sh
./install.sh
```

Le script `install.sh` exécute automatiquement :

1. `composer install --no-scripts` (empêche Flex d'écraser les configs)
2. Restauration des fichiers de configuration (bundles.php, doctrine.yaml, docker-compose.yml, .env.local)
3. `php bin/console cache:clear`
4. `docker compose up -d` (MySQL 8.0 sur port 3307 + phpMyAdmin sur 8081)
5. `doctrine:database:create`
6. `doctrine:schema:update --force`
7. `doctrine:fixtures:load` (8 médecins, 10 patients, 15 rendez-vous)
8. `symfony server:start -d`

### Accès

| Service | URL |
|---------|-----|
| **Application** | https://127.0.0.1:8000 |
| **phpMyAdmin** | http://localhost:8081 |

> Si le port 8000 est occupé, Symfony choisit automatiquement un autre port (8001, 8002...). Notez le port affiché par `symfony server:start` et mettez à jour `cypress.config.ts` en conséquence.

---

## 🧪 Tests Cypress

### Installation

```bash
npm install
```

### Configuration du port

Le fichier `cypress.config.ts` est configuré sur le port **8003**. Si votre serveur Symfony tourne sur un autre port, modifiez :

```typescript
e2e: {
  baseUrl: "https://127.0.0.1:VOTRE_PORT",
}
```

### Lancement

```bash
npm run cy:open           # Mode interactif (UI Cypress)
npm run cy:run            # Mode headless (terminal)
npm run cy:run:chrome     # Avec Chrome
```

### Lancer par domaine

```bash
npm run cy:run:navigation     # Sidebar, routing, breadcrumb
npm run cy:run:dashboard      # Tableau de bord
npm run cy:run:patients       # CRUD + recherche patients
npm run cy:run:medecins       # CRUD + filtre médecins
npm run cy:run:rdv            # CRUD + statuts + filtre RDV
npm run cy:run:scenarios      # Parcours E2E complets
```

---

## 📂 Structure du projet

```
medrdv/
├── install.sh                           # Script d'installation automatique
├── docker-compose.yml                   # MySQL 8.0 + phpMyAdmin
├── composer.json                        # Dépendances PHP
├── package.json                         # Dépendances Cypress
├── cypress.config.ts                    # Configuration Cypress
├── tsconfig.json                        # Configuration TypeScript
│
├── config/
│   ├── bundles.php
│   ├── routes.yaml
│   ├── services.yaml
│   └── packages/
│       ├── doctrine.yaml                # MySQL (pas PostgreSQL)
│       ├── framework.yaml
│       └── twig.yaml
│
├── src/
│   ├── Controller/
│   │   ├── DashboardController.php      # Tableau de bord + stats
│   │   ├── PatientController.php        # CRUD patients + recherche
│   │   ├── MedecinController.php        # CRUD médecins + filtre
│   │   └── RendezVousController.php     # CRUD RDV + changement statut
│   ├── Entity/
│   │   ├── Patient.php                  # NSS, nom, prénom, email...
│   │   ├── Medecin.php                  # Spécialité, n° ordre, honoraires...
│   │   └── RendezVous.php               # Statut, durée, motif, notes
│   ├── Form/
│   │   ├── PatientType.php
│   │   ├── MedecinType.php
│   │   └── RendezVousType.php
│   ├── Repository/
│   │   ├── PatientRepository.php        # findBySearch()
│   │   ├── MedecinRepository.php        # findBySpecialite()
│   │   └── RendezVousRepository.php     # findByStatut(), findTodayRendezVous()...
│   └── DataFixtures/
│       └── AppFixtures.php              # 8 médecins, 10 patients, 15 RDV
│
├── templates/
│   ├── base.html.twig                   # Layout sidebar + Bootstrap 5.3
│   ├── dashboard/index.html.twig
│   ├── patient/{index,show,new,edit}.html.twig
│   ├── medecin/{index,show,new,edit}.html.twig
│   └── rendezvous/{index,show,new,edit}.html.twig
│
└── cypress/
    ├── support/
    │   ├── e2e.ts                       # Point d'entrée
    │   ├── commands.ts                  # Custom commands
    │   └── index.d.ts                   # Déclarations TypeScript
    ├── fixtures/
    │   ├── patients.json
    │   ├── medecins.json
    │   └── rendezvous.json
    └── e2e/
        ├── navigation/navigation.cy.ts  #  8 tests
        ├── dashboard/dashboard.cy.ts    #  7 tests
        ├── patients/patients.cy.ts      # 16 tests
        ├── medecins/medecins.cy.ts      # 10 tests
        ├── rendezvous/rendezvous.cy.ts  # 16 tests
        └── scenarios/scenarios.cy.ts    # 11 tests
```

## 🧩 Tests unitaires PHPUnit

### Installation

```bash
composer install    # installe phpunit via require-dev
```

### Lancement

```bash
# Lancer tous les tests avec sortie testdox
vendor/bin/phpunit --testdox

# Avec couverture de code (HTML)
vendor/bin/phpunit --coverage-html coverage/

# Avec rapport JUnit XML
vendor/bin/phpunit --log-junit phpunit-report.xml
```

### Inventaire des tests unitaires (61 tests, 67 cas)

#### `tests/Unit/Entity/PatientTest.php` — 16 tests

| Test | Ce qu'il vérifie |
|------|------------------|
| testConstructeurInitialiseCreatedAt | `createdAt` est un `DateTimeImmutable` à la construction |
| testConstructeurInitialiseCollectionRendezVousVide | La collection RDV est vide |
| testIdEstNullAvantPersistance | `id` est null avant persist |
| testSetGetNom / Prenom / Email / Telephone | Getters et setters de base |
| testSetGetDateNaissance | Type `DateTime` |
| testSetGetNumeroSecuriteSocialeNullable | Nullable : null → valeur → null |
| testSetGetAdresseNullable | Nullable |
| testGetNomCompletConcatenePrenomEtNom | "Marie Dupont" |
| testToStringRetourneNomComplet | `__toString()` = nom complet |
| testAddRendezVousAjouteEtLieAuPatient | Ajoute + lie `$rdv->getPatient()` |
| testAddRendezVousNAjoutePasDeDoublon | Pas de doublon si ajouté 2 fois |
| testRemoveRendezVousRetireEtDeliePatient | Retire + met patient à null |
| testSettersRetournentLInstance | Fluent interface |

#### `tests/Unit/Entity/MedecinTest.php` — 16 tests

| Test | Ce qu'il vérifie |
|------|------------------|
| testConstructeurInitialiseCreatedAt | `createdAt` initialisé |
| testConstructeurInitialiseCollectionRendezVousVide | Collection vide |
| testSetGet* (7 tests) | Tous les getters/setters y compris nullables |
| testGetNomCompletCommenceParDr | "Dr. Claire Bernard" |
| testToStringContientNomCompletEtSpecialite | "Dr. Claire Bernard (Cardiologie)" |
| testAddRendezVous / Remove / Doublon | Relations bidirectionnelles |
| testSettersRetournentLInstance | Fluent interface |

#### `tests/Unit/Entity/RendezVousTest.php` — 29 tests (dont 2 dataProviders ×4)

| Test | Ce qu'il vérifie |
|------|------------------|
| testConstructeurInitialiseCreatedAt | `createdAt` initialisé |
| testStatutParDefautEstEnAttente | Statut par défaut = `en_attente` |
| testDureeParDefautEst30Minutes | Durée par défaut = 30 |
| testUpdatedAtEstNullALaCreation | `updatedAt` null au départ |
| testConstantesStatutExistent | Les 4 constantes STATUT_* |
| testTableauStatutsContient4Entrees | `STATUTS` a 4 entrées |
| testTableauStatutsAssocieLabelsAuxValeurs | Labels FR → valeurs techniques |
| **testGetStatutLabel** (×4 via dataProvider) | En attente, Confirmé, Annulé, Terminé |
| testGetStatutLabelRetourneLaValeurBruteSiInconnu | Statut inconnu → retourne la valeur brute |
| **testGetStatutBadgeClass** (×4 via dataProvider) | bg-warning, bg-success, bg-danger, bg-secondary |
| testGetStatutBadgeClassRetourneBgInfoSiInconnu | Statut inconnu → `bg-info` |
| testSetStatutMetAJourUpdatedAt | `setStatut()` initialise `updatedAt` |
| testSetStatutMetAJourUpdatedAtAChaqueAppel | Chaque appel rafraîchit le timestamp |
| testGetDateFinAjoute30MinutesParDefaut | 10:00 + 30min = 10:30 |
| testGetDateFinAjouteLaDureeConfiguree | 14:00 + 45min = 14:45 |
| testGetDateFinAvec60Minutes | 23:30 + 60min = 00:30 (jour suivant) |
| testGetDateFinRetourneNullSiPasDeDate | Null si dateHeure non définie |
| testGetDateFinNeModifiePasLaDateOrigine | Clone interne, pas de mutation |
| testSetGetPatient / Medecin | Relations ManyToOne |
| testToStringFormatComplet | Format "RDV #0 - Marie Leroy avec Dr. Paul Martin le 10/04/2025" |
| testToStringSansRelationsAffichePointInterrogation | "?" si patient/medecin null |
| testSettersRetournentLInstance | Fluent interface |

---

## 📊 Rapport Cypress HTML (mochawesome)

Le projet génère automatiquement un **rapport HTML** après chaque exécution Cypress.

### En local

```bash
# Lancer les tests (le rapport est généré automatiquement)
npm run cy:run

# Ouvrir le rapport
open cypress/reports/index.html       # macOS
xdg-open cypress/reports/index.html   # Linux
```

Le rapport inclut :
- Résumé global (passés, échoués, durée)
- Graphiques de réussite par suite
- Screenshots intégrés en cas d'échec
- Détail de chaque test avec timing

### Dans la CI/CD

Le rapport HTML est uploadé comme **artifact GitHub Actions** (`cypress-report-html`) après chaque exécution, accessible pendant 30 jours dans l'onglet Actions du repo.

---

### `navigation/navigation.cy.ts` — 8 tests

| Test | Description |
|------|-------------|
| Sidebar - logo | Vérifie l'affichage du logo et du nom MedRDV |
| Sidebar - liens | Vérifie la présence des 4 sections de navigation |
| Sidebar - lien actif | Vérifie la mise en surbrillance du lien courant |
| Sidebar - icônes | Vérifie la présence des icônes Bootstrap Icons |
| Routing - navigation | Navigue vers chaque section et vérifie l'URL |
| Routing - intercept | Intercepte les requêtes et vérifie le status 200 |
| Breadcrumb - affichage | Vérifie le fil d'Ariane sur une page de détail |
| Breadcrumb - retour liste | Vérifie le retour à la liste via le breadcrumb |

### `dashboard/dashboard.cy.ts` — 7 tests

| Test | Description |
|------|-------------|
| Titre | Vérifie le titre et sous-titre de la page |
| Cartes statistiques | Vérifie les 4 cartes avec valeurs numériques |
| Libellés | Vérifie Patients, Médecins, RDV aujourd'hui, RDV à venir |
| RDV du jour | Vérifie la section des rendez-vous du jour |
| Prochains RDV | Vérifie la section des prochains rendez-vous |
| Bouton Nouveau RDV | Vérifie la redirection vers /rendezvous/new |
| HTTP response | Intercepte et vérifie status 200 + content-type |

### `patients/patients.cy.ts` — 16 tests

| Test | Description |
|------|-------------|
| Liste - titre et compteur | Vérifie le titre et le nombre de patients |
| Liste - colonnes | Vérifie Nom, Email, Téléphone, Naissance, N° SS |
| Liste - données fixtures | Vérifie que Dupont, Leroy, Girard, Bonnet sont présents |
| Liste - boutons actions | Vérifie Voir et Modifier par ligne |
| Création - formulaire | Crée un patient via le custom command |
| Création - intercept POST | Intercepte le POST et vérifie les données |
| Création - validation | Vérifie le blocage si champs obligatoires vides |
| Fiche - informations | Vérifie Email, Tél, Naissance sur la fiche |
| Fiche - historique RDV | Vérifie la section historique |
| Fiche - lien modifier | Vérifie l'accès au formulaire de modification |
| Modification | Modifie téléphone et adresse |
| Suppression - confirm | Supprime après confirmation du dialogue |
| Suppression - intercept CSRF | Intercepte le POST et vérifie le token CSRF |
| Recherche - par nom | Recherche Dupont et vérifie les résultats |
| Recherche - touche Entrée | Soumet avec {enter} |
| Recherche - effacer | Efface et vérifie le retour à la liste complète |

### `medecins/medecins.cy.ts` — 10 tests

| Test | Description |
|------|-------------|
| Liste - cartes | Vérifie Dr., badge spécialité, bouton Détails |
| Liste - contact | Vérifie email et téléphone sur chaque carte |
| Création | Crée un médecin complet (nom, spécialité, honoraires...) |
| Création - spécialités select | Vérifie le contenu du select des spécialités |
| Fiche détaillée | Vérifie spécialité, contact et section planning |
| Modification | Modifie le numéro de téléphone |
| Suppression | Supprime après confirmation |
| Filtre - boutons | Vérifie les boutons avec Tous actif par défaut |
| Filtre - par spécialité | Filtre par Médecine générale et vérifie |
| Filtre - reset | Vérifie le retour à Tous |

### `rendezvous/rendezvous.cy.ts` — 16 tests

| Test | Description |
|------|-------------|
| Liste - tableau | Vérifie l'affichage avec 7+ colonnes |
| Liste - badges statut | Vérifie la présence d'un badge sur chaque ligne |
| Liste - liens Patient/Médecin | Vérifie les liens cliquables |
| Création - formulaire | Crée un RDV avec patient, médecin, date, motif |
| Création - selects dynamiques | Vérifie le contenu des selects Patient et Médecin |
| Création - intercept POST | Intercepte et vérifie method + status |
| Fiche - informations | Vérifie Patient, Médecin, Informations, Actions |
| Fiche - liens fiches | Vérifie les liens vers les fiches patient et médecin |
| Modification | Modifie le motif d'un RDV |
| Statut - boutons | Vérifie Confirmer et Annuler pour un RDV en attente |
| Statut - confirmer | Passe un RDV de En attente à Confirmé |
| Statut - annuler | Annule un RDV |
| Filtre - boutons | Vérifie Tous, En attente, Confirmés, Annulés, Terminés |
| Filtre - en attente | Filtre et vérifie badge bg-warning |
| Filtre - terminés | Filtre et vérifie badge bg-secondary |
| Filtre - couleurs CSS | Vérifie la correspondance statut → classe badge |

### `scenarios/scenarios.cy.ts` — 11 tests

| Test | Description |
|------|-------------|
| Parcours - créer patient | Crée Alice dans le scénario E2E |
| Parcours - créer médecin | Crée Dr. Marc chirurgien |
| Parcours - créer RDV | Prend RDV entre Alice et Dr. Marc |
| Parcours - retrouver RDV | Retrouve le RDV dans la liste |
| Parcours - confirmer + terminer | En attente → Confirmé → Terminé |
| Session - établir | Établit une session avec cy.session() |
| Session - réutiliser | Réutilise sans refaire le setup |
| Session - validate | cy.session() avec validate() |
| Cohérence - compteur patients | Compare dashboard vs nombre réel |
| Cohérence - compteur médecins | Compare dashboard vs nombre réel |
| Cohérence - historique patient | Vérifie que les RDV de Dupont apparaissent |

---

## 📦 Custom commands

Définis dans `cypress/support/commands.ts`, typés dans `cypress/support/index.d.ts` :

| Commande | Usage |
|----------|-------|
| `cy.createPatient({...})` | Remplit et soumet le formulaire /patient/new |
| `cy.createMedecin({...})` | Remplit et soumet le formulaire /medecin/new |
| `cy.createRendezVous({...})` | Remplit et soumet le formulaire /rendezvous/new |
| `cy.navigateTo("patients")` | Clique sur le lien sidebar correspondant |
| `cy.checkFlash("success", "créé")` | Vérifie un flash message Bootstrap |

---

## 📦 Fixtures de test

Fichiers JSON dans `cypress/fixtures/` utilisés avec `cy.fixture()` :

| Fichier | Contenu |
|---------|---------|
| `patients.json` | Patient à créer, données de modification, patient jetable, liste des existants |
| `medecins.json` | Médecin à créer, médecin jetable, liste des spécialités attendues |
| `rendezvous.json` | Mapping statuts ↔ libellés, mapping statuts ↔ classes CSS badges |

---

## 🔧 Concepts Cypress couverts

| Concept | Où il est utilisé |
|---------|-------------------|
| **Sélecteurs** `cy.get`, `cy.contains`, `cy.find`, `cy.within`, `cy.eq`, `cy.first`, `cy.parents` | navigation, dashboard, patients, medecins, rendezvous |
| **Interactions** `cy.click`, `cy.type`, `cy.clear`, `cy.select`, `{enter}`, `window:confirm` | patients, medecins, rendezvous |
| **Assertions** `should('exist')`, `be.visible`, `have.class`, `have.length`, `contain.text`, `have.value`, chaînage `.and()` | tous les fichiers |
| **Custom commands** `createPatient`, `createMedecin`, `createRendezVous`, `navigateTo`, `checkFlash` | patients, medecins, rendezvous, scenarios |
| **Fixtures** `cy.fixture('patients')` → chargement de données JSON | patients, medecins, rendezvous |
| **cy.intercept()** spy GET/POST, `cy.wait('@alias')`, `request.body`, `response.statusCode`, headers, token CSRF | navigation, dashboard, patients, rendezvous |
| **cy.session()** setup + validate, réutilisation de session | scenarios |
| **Hooks** `before()`, `beforeEach()` | tous les fichiers |
| **describe imbriqués** organisation Liste / Création / Modification / Suppression / Recherche | patients, medecins, rendezvous |

---

## 🧩 Tests unitaires & fonctionnels (PHPUnit)

### Installation

```bash
composer install    # inclut phpunit et symfony/test-pack en dev
```

### Lancement

```bash
# Tous les tests
php vendor/bin/phpunit

# Tests unitaires seuls (Entity)
php vendor/bin/phpunit --testsuite Unit

# Tests fonctionnels seuls (Controller)
php vendor/bin/phpunit --testsuite Functional

# Avec rapport JUnit XML
php vendor/bin/phpunit --log-junit var/reports/junit.xml

# Avec couverture de code (nécessite Xdebug)
XDEBUG_MODE=coverage php vendor/bin/phpunit --coverage-html var/reports/coverage-html
```

### Structure des tests

```
tests/
├── bootstrap.php                          # Bootstrap PHPUnit
├── Entity/                                # Tests unitaires (sans BDD)
│   ├── PatientTest.php                    # 14 tests
│   ├── MedecinTest.php                    # 13 tests
│   └── RendezVousTest.php                 # 22 tests
└── Controller/                            # Tests fonctionnels (WebTestCase)
    ├── DashboardControllerTest.php        #  6 tests
    ├── PatientControllerTest.php          # 10 tests
    ├── MedecinControllerTest.php          #  8 tests
    └── RendezVousControllerTest.php       # 10 tests
```

### Inventaire des tests PHPUnit (83 tests)

#### Tests unitaires — `tests/Entity/` (49 tests)

**PatientTest.php (14 tests)**

| Test | Description |
|------|-------------|
| testIdEstNullParDefaut | Vérifie que l'ID est null à l'instanciation |
| testSetEtGetNom | Getter/setter nom |
| testSetEtGetPrenom | Getter/setter prénom |
| testSetEtGetEmail | Getter/setter email |
| testSetEtGetTelephone | Getter/setter téléphone |
| testSetEtGetDateNaissance | Getter/setter date de naissance |
| testSetEtGetNumeroSecuriteSociale | Getter/setter NSS |
| testNumeroSecuriteSocialeEstNullParDefaut | NSS null par défaut |
| testSetEtGetAdresse | Getter/setter adresse |
| testAdresseEstNullParDefaut | Adresse null par défaut |
| testGetNomComplet | Vérifie "Prénom Nom" |
| testCreatedAtEstInitialiseAutomatiquement | DateTimeImmutable auto |
| testToStringRetourneNomComplet | Cast string → nom complet |
| testRendezVousCollectionVideParDefaut | Collection vide |
| testAddRendezVous | Ajout + relation bidirectionnelle |
| testAddRendezVousNAjoutePasDeDoublon | Pas de doublon |
| testRemoveRendezVous | Suppression + null sur relation |
| testSettersRetournentLInstance | Fluent interface |

**MedecinTest.php (13 tests)**

| Test | Description |
|------|-------------|
| testIdEstNullParDefaut | ID null à l'instanciation |
| testSetEtGet[Nom/Prenom/Specialite/Email/Telephone] | Getters/setters champs obligatoires |
| testSetEtGet[NumeroOrdre/AdresseCabinet/Honoraires] | Getters/setters champs optionnels |
| testGetNomCompletAvecPrefixeDr | Vérifie "Dr. Prénom Nom" |
| testToStringContientNomEtSpecialite | Cast string → Dr. + spécialité |
| testAddRendezVous / testRemoveRendezVous | Collection bidirectionnelle |
| testSettersRetournentLInstance | Fluent interface |

**RendezVousTest.php (22 tests)**

| Test | Description |
|------|-------------|
| testConstantesDeStatut | Vérifie les 4 constantes STATUT_* |
| testTableauStatutsContient4Entrees | Vérifie les clés du tableau STATUTS |
| testStatutParDefautEstEnAttente | Statut initial = en_attente |
| testDureeParDefautEst30Minutes | Durée initiale = 30 |
| testSetStatutMetAJourUpdatedAt | updatedAt auto lors du changement |
| testGetStatutLabel (x4, dataProvider) | Mapping statut → libellé FR |
| testGetStatutBadgeClass (x4, dataProvider) | Mapping statut → classe CSS |
| testGetStatutBadgeClassInconnuRetourneBgInfo | Fallback bg-info |
| testGetDateFinAjoute30MinutesParDefaut | Calcul date fin (30 min) |
| testGetDateFinAvecDureePersonnalisee | Calcul date fin (60 min) |
| testGetDateFinAvec15Minutes | Calcul date fin (15 min) |
| testGetDateFinRetourneNullSiPasDeDate | Null si pas de dateHeure |
| testGetDateFinNeModifiePasLeDateDorigine | Clone (pas de mutation) |
| testToStringAvecDonneesCompletes | Format complet avec patient + médecin |
| testToStringSansDonneesAfficheInterrogations | Fallback avec ? |
| testSettersRetournentLInstance | Fluent interface |

#### Tests fonctionnels — `tests/Controller/` (34 tests)

**DashboardControllerTest.php (6 tests)**

| Test | Description |
|------|-------------|
| testPageAccueilRetourne200 | GET / → 200 |
| testPageAccueilContientTitre | h2 = "Tableau de bord" |
| testPageAccueilAffiche4CartesStatistiques | 4 × .stat-card |
| testPageAccueilContientLienNouveauRdv | Lien vers /rendezvous/new |
| testPageAccueilAfficheSidebar | Sidebar avec 4 nav-links |
| testPageAccueilContentTypeHtml | Content-Type = text/html |

**PatientControllerTest.php (10 tests)**

| Test | Description |
|------|-------------|
| testListeRetourne200 | GET /patient → 200 |
| testListeAfficheTableau | Tableau + titre Patients |
| testListeAfficheColonnesAttendues | Colonnes Nom, Email |
| testListeContientPatientsDesFixtures | Dupont dans le tableau |
| testRechercheParNom | ?q=Dupont → résultats filtrés |
| testRechercheVide | Recherche inexistante → 0 résultat |
| testFormulaireCreationRetourne200 | GET /patient/new → formulaire |
| testCreationPatientValide | POST → redirect + flash success |
| testFichePatientRetourne200 | GET /patient/{id} → 200 |
| testPatientInexistantRetourne404 | GET /patient/99999 → 404 |

**MedecinControllerTest.php (8 tests)**

| Test | Description |
|------|-------------|
| testListeRetourne200 | GET /medecin → 200 |
| testListeAfficheCartes | Cartes avec Dr. |
| testCartesContiennentPrefixeDr | Préfixe Dr. sur les noms |
| testFiltreParSpecialite | ?specialite=Cardiologie → résultats filtrés |
| testFormulaireCreationRetourne200 | GET /medecin/new → formulaire |
| testCreationMedecinValide | POST → redirect + flash success |
| testFicheMedecinRetourne200 | GET /medecin/{id} → 200 |
| testMedecinInexistantRetourne404 | GET /medecin/99999 → 404 |

**RendezVousControllerTest.php (10 tests)**

| Test | Description |
|------|-------------|
| testListeRetourne200 | GET /rendezvous → 200 |
| testListeAfficheTableau | Tableau + titre Rendez-vous |
| testListeContientBadgesStatut | Badges dans le tableau |
| testFiltreParStatutEnAttente | ?statut=en_attente → badges filtrés |
| testFormulaireCreationRetourne200 | GET /rendezvous/new → formulaire |
| testFormulaireContientSelectsPatientEtMedecin | Selects patient + médecin remplis |
| testFicheRendezVousRetourne200 | GET /rendezvous/{id} → 200 |
| testFicheAfficheInformationsRdv | Patient + Médecin affichés |
| testRdvInexistantRetourne404 | GET /rendezvous/99999 → 404 |
| testChangementStatutSansCsrfRedirigeVersShow | POST sans CSRF → redirect |

---

## 🚀 Pipeline CI/CD (GitHub Actions)

Le fichier `.github/workflows/ci-cd.yml` définit une pipeline complète en 6 jobs :

```
  ┌─────────────┐
  │  📦 Install  │  Composer install + npm ci
  └──────┬──────┘
         │
    ┌────┼──────────────────────┐
    ▼    ▼           ▼          ▼
┌───────┐ ┌────────┐ ┌────────┐ ┌───────┐
│🔨Build│ │🧩PHPUnit│ │🧪Cypress│ │🔒Trivy│  (en parallèle)
└───┬───┘ └───┬────┘ └───┬────┘ └───┬───┘
    │         │           │          │
    └─────────┴───────────┼──────────┘
                          ▼
                   ┌─────────────┐
                   │🐳 Docker    │  Build & Push (main uniquement)
                   │  Build+Push │
                   └─────────────┘
```

### Jobs

| Job | Description | Artifacts |
|-----|-------------|-----------|
| **📦 Install** | `composer install --no-scripts` + `npm ci`, cache des dépendances | vendor/, node_modules/ |
| **🔨 Build** | Cache clear, lint Twig, lint container, validation Doctrine, fixtures | — |
| **🧩 PHPUnit** | 83 tests (49 unitaires + 34 fonctionnels), couverture de code, rapport JUnit | `phpunit-coverage-report`, `phpunit-junit-reports` |
| **🧪 Cypress** | 68 tests E2E Chrome | `cypress-screenshots`, `cypress-videos` |
| **🔒 Trivy** | Scan filesystem (CRITICAL + HIGH), export SARIF | SARIF → onglet Security |
| **🐳 Docker** | Scan Trivy image, build multi-stage, push ghcr.io | Image Docker |

### Rapports générés

| Rapport | Format | Emplacement |
|---------|--------|-------------|
| **PHPUnit JUnit** | XML | Onglet "Checks" → 📊 Rapport PHPUnit |
| **Couverture de code** | HTML | Artifact `phpunit-coverage-report` |
| **Couverture Clover** | XML | Résumé dans le Job Summary |
| **Screenshots Cypress** | PNG | Artifact `cypress-screenshots` (si échec) |
| **Trivy SARIF** | SARIF | Onglet "Security" de GitHub |

### Services utilisés dans la CI

- **MySQL 8.0** : service Docker dans les jobs Build, PHPUnit et Cypress (port 3306)
- **PHP built-in server** : `php -S 127.0.0.1:8000` pour Cypress (pas de Symfony CLI nécessaire)

### Image Docker

L'image Docker utilise un build multi-stage :
1. **Stage Composer** : installe les dépendances PHP (sans dev)
2. **Stage Production** : PHP 8.2-FPM + Nginx + Supervisor sur Alpine

```bash
# Pull depuis GitHub Container Registry
docker pull ghcr.io/VOTRE_USER/medrdv:latest

# Lancer avec une base MySQL externe
docker run -d -p 80:80 \
  -e DATABASE_URL="mysql://user:pass@host:3306/db" \
  ghcr.io/VOTRE_USER/medrdv:latest
```

### Tags Docker générés

| Tag | Quand |
|-----|-------|
| `latest` | Push sur `main` |
| `main` | Push sur `main` |
| `<sha>` | Chaque push (hash du commit) |
| `<version>` | Tags semver (ex: `v1.0.0`) |

### Fichiers ajoutés pour le CI/CD

```
medrdv/
├── .github/workflows/ci-cd.yml    # Pipeline GitHub Actions (6 jobs)
├── Dockerfile                      # Image multi-stage PHP-FPM + Nginx
├── .dockerignore                   # Fichiers exclus du build Docker
├── phpunit.xml.dist                # Configuration PHPUnit + rapports
├── .env.test                       # Variables d'env pour les tests
├── docker/
│   ├── nginx.conf                  # Configuration Nginx pour Symfony
│   └── supervisord.conf            # Supervisor : lance PHP-FPM + Nginx
└── tests/
    ├── bootstrap.php               # Bootstrap PHPUnit
    ├── Entity/                     # 49 tests unitaires
    │   ├── PatientTest.php
    │   ├── MedecinTest.php
    │   └── RendezVousTest.php
    └── Controller/                 # 34 tests fonctionnels
        ├── DashboardControllerTest.php
        ├── PatientControllerTest.php
        ├── MedecinControllerTest.php
        └── RendezVousControllerTest.php
```
