# Livre-GraphQL

Un projet d'entraînement GraphQL permettant de référencer et gérer une collection de livres.

## 📚 À propos

Livre-GraphQL est un projet personnel développé pour se familiariser avec GraphQL, TypeScript et Node.js. Il offre une API GraphQL pour gérer un référentiel de livres avec des opérations CRUD complètes.

## 🚀 Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **TypeScript** - Typage statique pour JavaScript
- **GraphQL** - Langage de requête pour l'API
- **Apollo Server** - Serveur GraphQL

## 📋 Fonctionnalités

- Création de nouveaux livres
- Consultation de la liste des livres
- Recherche de livres par critères
- Mise à jour des informations d'un livre
- Suppression de livres

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/Livre-GraphQL.git

# Accéder au dossier du projet
cd Livre-GraphQL

# Installer les dépendances
npm install
```

## 💻 Utilisation

```bash
# Lancer en mode développement
npm run dev

# Compiler le TypeScript
npm run build

# Lancer en production
npm start
```

L'API GraphQL sera accessible à l'adresse : `http://localhost:4000/graphql`

## 🐋 Avec Docker

Permet de lancer également la base de données et la seed de données associée.

```bash
# Lancer le docker compose
docker compose up -d
```

## 📝 Exemples de requêtes

### Récupérer tous les livres

```graphql
query {
  livres {
    id
    titre
    auteur
    anneePublication
  }
}
```

### Ajouter un livre

```graphql
mutation {
  createLivre(input: {
    titre: "Le Petit Prince"
    resume: "L'histoire d'un petit prince qui voyage de planète en planète"
    dateParution: "1943-04-06"
    dateParutionFrance: "1946-01-01"
    nbPage: 96
    auteur_id: 1
    pays_id: 1
  }) {
    id
    titre
    resume
    dateParution
    nbPage
  }
}
```

### Récupérer un livre par ID

```graphql
query {
  livre(id: 1) {
    id
    titre
    resume
    dateParution
    dateParutionFrance
    auteurId
    themeId
    paysId
    nbPage
    createdAt
  }
}
```

### Récupérer les livres d'un auteur

```graphql
query {
  auteur(id: 1) {
    id
    nom
    prenom
    description
    createdAt
    livres {
      id
      titre
      resume
      dateParution
      nbPage
    }
  }
}
```

### Récupérer les livres d'un thème

```graphql
query {
  theme(id: 1) {
    id
    titre
    adulte
    createdAt
    livres {
      id
      titre
      resume
      dateParution
      auteurId
    }
  }
}
```

### Récupérer les livres d'un pays

```graphql
query {
  pays(id: 1) {
    id
    nom
    createdAt
    livres {
      id
      titre
      resume
      dateParutionFrance
      auteurId
    }
  }
}
```

## 🎯 Objectifs d'apprentissage

Ce projet a été créé pour :

- Comprendre les concepts fondamentaux de GraphQL
- Pratiquer TypeScript dans un contexte backend
- Mettre en place un serveur GraphQL avec Node.js
- Gérer les requêtes (queries) et mutations GraphQL
- Structurer un projet backend moderne

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet :

```env
PORT=4000
NODE_ENV=development
```

## 📚 Ressources

- [Documentation GraphQL](https://graphql.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

## 📄 Licence

Ce projet est un projet d'entraînement personnel et est libre d'utilisation.

## 👤 Auteur

Aurélie Moustardier - Projet d'entraînement GraphQL

---
