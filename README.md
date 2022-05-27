# Nodejs Boilerplate API

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
npm run install

# Pour lancer l'API
npm run api
```

L'API est accessible à l'adresse : `http://localhost:5050`.


## Explications

1. [Setup du projet et factorisation](./documentation/001-factorisation/README.md)