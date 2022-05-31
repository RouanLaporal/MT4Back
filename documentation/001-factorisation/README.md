

[[_TOC_]]

# Projet Setup

On utilise Docker Dev Containers pour l'environnement de dev. Il faut ouvrir VS Code, est lorsque VSCode demande de rouvrir la fenêtre dans un dev-container, il faut cliquer sur oui.

Cette fois-ci, on a amélioré le `Dockerfile.dev` afin de préinstaller quelques outils pratiques :
* `mycli` : un client `mysql` qui permet de communiquer avec la base de données **au sein de notre dev-container**. Cela veut dire qu'on peut maintenant initialiser et modifier le schema de notre base du terminal dans VSCode.
* `ts-node` et `typescript` : pour éviter l'install global, et pour que ces 2 commandes soit disponibles dans le terminal dans VSCode.

[Regardez Dockerfile.dev](./Dockerfile.dev)

On a aussi configuré intelligemment la base de données pour s'initialiser tout seul. Dans [`docker-compose.dev.yml`](./docker-compose.dev.yml) on a ajouté 2 volumes supplémentaires qui pointent vers le dossier `/docker-entrypoint-initdb.d/`. A sa première initialisation, MariaDB va executer les scripts qui se trouve dans ce dossier dans l'ordre alphabétique. Dans notre cas:  
1. mariadb va se lancer avec les paramètres de notre fichier [`.env.dev`](./dbms/.env.dev). Attention, nous avons ajouté la variable `MYSQL_DATABASE=mtdb` pour préciser la base par défaut à utiliser pour les scripts d'initialisation.
2. nous commençons par créer la base et un utilisateur [`dbms/dev-initdb.d/001-init-dev.sql`](./dbms/dev-initdb.d/001-init-dev.sql)
3. on monte aussi [`dbms/ddl/ddl.sql`](./dbms/ddl/ddl.sql) dans `/docker-entrypoint-initdb.d/999-ddl.sql`. Ce script va initialiser notre schema, et on attache le préfixe `999-` devant pour être sur qu'il est executé en dernier.

Voici le morceau de [`docker-compose.dev.yml`](./docker-compose.dev.yml) qui a changé :
```
  # docker-compose.dev.yml
  dbms:
    image: mariadb
    ...
    volumes:
      - ./dbms/dbms-data:/var/lib/mysql
      - ./dbms/mariadb.cnf:/etc/mysql/mariadb.cnf
      # Pointer vers un dossier qui aura des scripts d'initialisation de notre base
      - ./dbms/dev-initdb.d:/docker-entrypoint-initdb.d
      # Ajouter le DDL qui va tourner en dernier
      - ./dbms/ddl/ddl.sql:/docker-entrypoint-initdb.d/999-ddl.sql
```

> Pourquoi ce setup ?
> 
> En séparant l'initialisation et le ddl, nous ouvrons les portes pour la création d'autres bases pour les fins différents. Par exemple, les tests automatiques.


# Refactoring

## Un schema de nos données en TypeScript

* [Liste de tables](../../src/types/tables/tables.d.ts)
* [Schema de la table user](../../src/types/tables/user/IUser.d.ts)


## Refactoring de notre class utilitaire `Crud.ts`

* [Crud.ts](../../src/classes/Crud.ts)
    * Noter l'usage de génériques
    * La requête indexe avec la clause `where` (dans le count)
    * Validation des données

## Validation de données

Un exemple avec [AJV](https://github.com/ajv-validator/ajv)

* [Validation de l'utilisateur avec avg](../../src/types/tables/user/user.validator.ts)
* [Passer une validateur optional à Crud.ts](../../src/classes/Crud.ts)

## Refactoring extreme

* [Une fonction qui créer des `Routers` Express à partir d'une définition](../../src/classes/CrudRouter.ts)
* [Exemple d'usage de cette fonction](../../src/routes/auth/user.ts)

## Gestion d'erreurs

* [Une structure d'erreurs normalisée](../../src/types/api/IApiError.ts)
* [Un middleware pour la gestion globale d'erruers](../../src/middleware/error-handler.ts)
* [Attacher le middleware de gestion d'erreur](../../src/api.ts)