#!/bin/bash
set -e

echo ""
echo "🏥 =============================="
echo "🏥  Installation de MedRDV"
echo "🏥 =============================="
echo ""

# ============================================================
# ÉTAPE 1 : Composer install SANS scripts (évite les erreurs Flex)
# ============================================================
echo "📦 1/7 - Installation des dépendances..."
composer install --no-scripts

# ============================================================
# ÉTAPE 2 : Corriger TOUT ce que Flex a cassé
# ============================================================
echo "🔧 2/7 - Correction des fichiers de config..."

# 2a. Forcer bundles.php (supprimer TwigExtraBundle si Flex l'a ajouté)
cat > config/bundles.php << 'PHP'
<?php

return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle::class => ['dev' => true, 'test' => true],
];
PHP

# 2b. Forcer doctrine.yaml (MySQL, pas PostgreSQL)
cat > config/packages/doctrine.yaml << 'YAML'
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'
        profiling_collect_backtrace: '%kernel.debug%'
    orm:
        auto_generate_proxy_classes: true
        enable_lazy_ghost_objects: true
        naming_strategy: doctrine.orm.naming_strategy.underscore_number_aware
        auto_mapping: true
        mappings:
            App:
                type: attribute
                is_bundle: false
                dir: '%kernel.project_dir%/src/Entity'
                prefix: 'App\Entity'
                alias: App
YAML

# 2c. Forcer docker-compose.yml (MySQL uniquement, port 3307)
cat > docker-compose.yml << 'DOCKER'
services:
  database:
    image: mysql:8.0
    container_name: medrdv_db
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_pass
      MYSQL_DATABASE: medrdv_db
      MYSQL_USER: medrdv_user
      MYSQL_PASSWORD: medrdv_pass
    volumes:
      - db_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: medrdv_pma
    ports:
      - "8081:80"
    environment:
      PMA_HOST: database
      PMA_USER: medrdv_user
      PMA_PASSWORD: medrdv_pass
    depends_on:
      - database

volumes:
  db_data:
DOCKER

# 2d. Forcer .env.local (prioritaire sur .env, Flex-proof)
cat > .env.local << 'ENV'
DATABASE_URL="mysql://medrdv_user:medrdv_pass@127.0.0.1:3307/medrdv_db?serverVersion=8.0.32&charset=utf8mb4"
ENV

# ============================================================
# ÉTAPE 3 : Vider le cache
# ============================================================
echo "🧹 3/7 - Nettoyage du cache..."
php bin/console cache:clear

# ============================================================
# ÉTAPE 4 : Démarrer Docker (MySQL)
# ============================================================
echo "🐳 4/7 - Démarrage de MySQL..."
docker compose up -d
echo "⏳ Attente de MySQL (10s)..."
sleep 10

# ============================================================
# ÉTAPE 5 : Créer la base de données
# ============================================================
echo "🗄️  5/7 - Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists

# ============================================================
# ÉTAPE 6 : Créer le schéma + charger les fixtures
# ============================================================
echo "📐 6/7 - Création du schéma + données de démo..."
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load --no-interaction

# ============================================================
# ÉTAPE 7 : Démarrer Symfony
# ============================================================
echo "🚀 7/7 - Démarrage du serveur..."
symfony server:start -d

echo ""
echo "✅ ======================================"
echo "✅  MedRDV est prêt !"
echo "✅ ======================================"
echo ""
echo "  📌 Application : https://127.0.0.1:8000"
echo "  📌 phpMyAdmin  : http://localhost:8081"
echo ""
echo "  Pour arrêter : symfony server:stop && docker compose down"
echo ""
