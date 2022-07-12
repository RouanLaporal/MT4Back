# Nodejs Manhattan Project API

Ce repo contient des exemples d'une base de projet en NodeJS/Typescript.

La projet évolue au fur et à mesure dans les différentes branches. Utilisez `git checkout [nom de la branche]` afin de passer entre les branches.

[[_TOC_]]

## TL;DR

Lancez VSCode, et accepter de ré-ouvrir le projet dans un Dev Container.

Dans VSCode, on peut facilement accéder à la base :

```sh
mycli -h dbms -u root
# Ensuite, utilisez le mot de passe dans .env.dev
```

Pour lancer le serveur en développement (depuis un terminal dans VSCode) :

```sh
# A faire une fois avant le premier lancement
npm install

# Pour lancer l'API
npm run api
```

L'API est accessible à l'adresse : `http://localhost:5050`.

# Pour générer la doc et les routes
npm run swagger

    # Les fichiers seront crées :
    # - public/swagger.json
    # - routes/routes.ts

# Pour compiler une version de déploiement (pas nécessaire pour lancer l'API)
npm run build

# Pour ouvrir sur une interface web la doc OpenAPI avec Swagger.io

    # Ouvrir le fichier swagger.json
    # Copier le fichier
    # Ouvrir sur un navigateur la page : `https://editor.swagger.io/`
    # Copier dans le champs à gauche le script swagger.json

## Explications

1. [Setup du projet et factorisation](./documentation/001-factorisation/README.md)