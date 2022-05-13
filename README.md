# Nodejs Boilerplate API

[[_TOC_]]

# Mise en service

On utilise Docker Dev Containers pour l'environnement de dev. Il faut ouvrir VS Code, est lorsque VSCode demande de rouvrir la fenêtre dans un dev-container, il faut cliquer sur oui.

Cette fois-ci, on a amélioré le `Dockerfile.dev` afin de préinstaller quelques outils pratiques :
* `mycli` : un client `mysql` qui permet de communiquer avec la base de données **au sein de notre dev-container**. Cela veut dire qu'on peut maintenant initialiser et modifier le schema de notre base du terminal dans VSCode.
* `ts-node` et `typescript` : pour éviter l'install global, et pour que ces 2 commandes soit disponibles dans le terminal dans VSCode.

[Regardez Dockerfile.dev](./Dockerfile.dev)

Au premier lancement, il faut initialiser la base de données de test. Ouvrez une ligne de commande et tapez le commandes suivants :

```sh
# Créer la base "mtdb" et initialiser l'utilisateur de dev pour notre api
mycli -h dbms -u root < ./dbms/init-dev.sql

# Créer la structure de la base
mycli -h dbms -u root -D mtdb < ./dbms/ddl.sql 
```

Pourquoi séparer en deux opérations ? Vous remarquez que le nom de la base `mtdb` est précisé maintenant dans la 2ème commande, et pas au sein du ddl. Cela veut dire qu'on peut réutiliser le même ddl en production, mais peut-être avec un autre nom.

Pour lancer le serveur en développement (depuis un terminal dans VSCode) :

```sh
npm run api
```

