# 🚀 Freelance Pro

Plateforme de recherche de travail freelance - Mini-projet Linux & DevOps.

## 📋 Prérequis

Avant de commencer, assure-toi d'avoir installé :

| Outil | Version | Lien d'installation |
|-------|---------|---------------------|
| **Docker** | 20.10+ | [docs.docker.com](https://docs.docker.com/get-docker/) |
| **Docker Compose** | 2.0+ | Inclus avec Docker Desktop |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |
| **Node.js** *(optionnel)* | 20+ | [nodejs.org](https://nodejs.org/) |

### Vérification rapide :
```bash
docker --version          # Docker version 24.x.x
docker-compose --version  # Docker Compose version 2.x.x
git --version             # git version 2.x.x
```

---

## 🚀 Démarrage rapide (5 minutes)

### Étape 1 : Cloner le projet
```bash
git clone https://github.com/ton-user/linux-project.git
cd linux-project
```

### Étape 2 : Configurer l'environnement
```bash
# Copier le template de variables
cp .env.example .env

# Éditer le fichier .env avec tes valeurs
nano .env
# OU
notepad .env
```

> **⚠️ Important :** Remplace toutes les valeurs `your_..._here` par tes vrais mots de passe !

### Étape 3 : Lancer l'application
```bash
# Premier démarrage (build + lancement)
docker-compose up -d --build

# Si les images sont déjà buildées
docker-compose up -d
```

### Étape 4 : Vérifier que tout fonctionne
```bash
# Voir les containers actifs
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Tester l'application
curl http://localhost
```

### Étape 5 : Accéder aux services

| Service | URL | Identifiants |
|---------|-----|--------------|
| 🌐 **Application** | http://localhost | - |
| 🔧 **PhpMyAdmin** | http://localhost:8080 | root / *ton MYSQL_ROOT_PASSWORD* |
| 🔌 **API Backend** | http://localhost/api | JWT Token requis |

### Étape 6 : Arrêter l'application
```bash
# Arrêter les containers
docker-compose down

# Arrêter + supprimer TOUTES les données (⚠️ base de données perdue)
docker-compose down -v
```

---

## ⚙️ Variables d'environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL | - | ✅ **Oui** |
| `MYSQL_DATABASE` | Nom de la base de données | `laravel` | ❌ Non |
| `MYSQL_USER` | Utilisateur applicatif | `laravel` | ❌ Non |
| `MYSQL_PASSWORD` | Mot de passe utilisateur | - | ✅ **Oui** |
| `JWT_SECRET` | Clé secrète pour l'authentification | - | ✅ **Oui** |
| `APP_KEY` | Clé de chiffrement Laravel | - | ✅ **Oui** |
| `NGINX_PORT` | Port d'accès à l'application | `80` | ❌ Non |
| `PHPMYADMIN_PORT` | Port de PhpMyAdmin | `8080` | ❌ Non |
| `FRONTEND_PORT` | Port du frontend Angular | `4200` | ❌ Non |

### Générer les clés Laravel :
```bash
# Dans le container backend
docker-compose exec backend php artisan key:generate

# Générer le JWT secret
docker-compose exec backend php artisan jwt:secret
```

---

## 🏗️ Architecture du projet

```
┌─────────────────────────────────────────┐
│              CLIENT                     │
│         (Navigateur Web)                │
│         http://localhost                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│              NGINX                      │
│         (Reverse Proxy)                 │
│            Port 80                      │
└────────┬────────────────────┬───────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────────┐
│   FRONTEND      │  │     BACKEND         │
│  Angular 19 SSR │  │   Laravel 13        │
│   Node.js 20    │  │   PHP 8.3-FPM       │
│   Port 4200     │  │   API REST + JWT    │
└─────────────────┘  └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MySQL 8.0      │
                    │    Base de données  │
                    │     Port 3306       │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PhpMyAdmin       │
                    │  Gestion DB (UI)    │
                    │     Port 8080       │
                    └─────────────────────┘
```

---

## 🧪 Tests

```bash
# --- Tests Backend (Laravel / PHPUnit) ---
docker-compose exec backend php artisan test

# --- Tests Frontend (Angular / Karma) ---
docker-compose exec frontend npm test

# --- Tests avec couverture ---
docker-compose exec backend php artisan test --coverage
```

---

## 🔧 Commandes utiles

```bash
# Entrer dans un container
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f mysql

# Rebuild une image spécifique
docker-compose build backend

# Redémarrer un service
docker-compose restart nginx
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| `Connection refused` sur le port 80 | Vérifier que NGINX_PORT=80 et qu'aucun autre service n'utilise ce port |
| `Access denied for user` | Vérifier MYSQL_ROOT_PASSWORD dans .env et redémarrer mysql |
| `JWT secret not set` | Exécuter `docker-compose exec backend php artisan jwt:secret` |
| Frontend ne se charge pas | Vérifier les logs : `docker-compose logs frontend` |

---

## 📚 Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | Angular | 19.2.0 |
| Backend | Laravel | 13.0 |
| Langage | PHP | 8.3 |
| Serveur | Nginx | Alpine |
| Base de données | MySQL | 8.0 |
| Auth | JWT-Auth | - |
| Container | Docker | 24.x |
| Orchestration | Docker Compose | 2.x |

---

## 👥 Auteurs

- **Ton Nom** - Développeur principal
- Mini-projet Linux & DevOps - 2026

## 📝 License

Ce projet est sous licence MIT.
