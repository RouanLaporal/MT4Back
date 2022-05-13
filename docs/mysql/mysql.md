# MySQL

On veut maintenant établir une connexion à une base de données, commencer à ajouter et supprimer les lignes.

## Dev Container et `docker-compose.yml`

On peut directement inclure une instance d'un SGBDR à notre dev-container grace à docker :

#### **docker-compose.yml**
```yml

  ...

  dbms:
    image: mariadb
    restart: always
    ports:
      - "3309:3306"
    env_file: 
      - ./dbms/.env
    command: [
      "--character-set-server=utf8mb4",
      "--collation-server=utf8mb4_unicode_ci",
    ]
    volumes:
      - ./dbms/dbms-data:/var/lib/mysql
      - ./dbms/mariadb.cnf:/etc/mysql/mariadb.cnf
    networks:
      - app-network
```

Il faut faire le suivant :
* Ajouter les lignes dessus à `docker-compose.dev.yml`
* Ajouter le dossier `dbms` avec le `.env` contenant votre mote de passe de l'utilisateur `root`
* Ajouter le fichier `mariadb.cnf` dans le dossier `dbms`. [Trouver un exemple ici](../../dbms/mariadb.cnf)
* Dans une invite de commande, naviguer vers votre dossier de travail, et émettre : `docker-compose -f docker-compose.dev.yml up dbms`
* Le SGBDR est désormais disponible.

Docker gère automatiquement les connexions et ports pour nous :
* Le nome d'hôte est le nom du service (`dbms`)
* Le port est automatiquement mappé par docker, pas besoin de le préciser dans notre code

Vous pouvez connecter à votre SGBDR avec :

```sh
docker exec -it [ID ou nom du conteneur] mysql -u root -p
```

Ensuite, vous pouvez [créer votre base de données, l'utilisateur pour notre api, et créer les premières tables](../../dbms/init.sql).

## Integration NodeJS

Nous utilisons la librairie `mysql2` pour communiquer avec notre base de données.

Normalement notre API va ouvrir une connexion unique auprès du SGBDR pour chaque requête en cours. Ceci peut-être lourd et longue, donc le créateur de la librairies à prévu les **connection pools**. C'est à dire, on va essayer de réutiliser les connexions déjà ouvertes.

Moi je préfère créer une classe qui enveloppe l'objet principal, pour ne pas répéter du code :

```ts
import mysql, { Pool } from 'mysql2/promise';

/** Wrapper de la connexion à la SGBDR.
 * On stock une seule référence à la connexion-pool, et on va systématiquement
 * récupérer cette référence pour nos requêtes.
 */
export class DB {

  // Variable "static": une seule instance pour toutes les instances de la classe DB
  private static POOL: Pool;

  /**
   * Récupérer ou créer la connexion-pool.
   */
  static get Connection(): Pool {
    if (!this.POOL) {
      this.POOL = mysql.createPool({
        host: process.env.DB_HOST || 'dbms',
        user: process.env.DB_USER || 'api-dev',
        database: process.env.DB_DATABASE || 'test',
        password: process.env.DB_PASSWORD || 'api-dev-password',  
      });
    }

    return this.POOL;
  }

}
```

Ici, on crée une variable static, et on initialise notre **pool** avec les coordonnées tirés de l'environnement (ou des valeurs par défaut).

## Opérations CRUD

Un exemple de [l'utilisation de la librairie se trouve ici](../../src/mysql/demo-mysql.ts).

Il y a plusieurs choses à noter.

### L'utilisation des types

Une force de Typescript est le fait de pouvoir contrôler les types du début à la fin, même avec les **génériques*. 

En effet, Express est écrit avec les **génériques**. Nous pouvons donc préciser la structure des types qui entre dans le corps du message, dans le params query, et à renvoyer dans la réponse :

```ts
// la fonction get avec les génériques, précisés entre les balises <...> :
// 1 - les *params*
// 2 - la structure de la réponse
// 3 - la structure du corps (body)
// 4 - la structure des params query
routerIndex.get<{}, IIndexResponse<IUserRO>, {}, IIndexQuery>('/',
```

Quand on va récupérer `request.query`, par exemple, l'objet typescript retourné va conformer à la structure précisée dans le 4ème paramètre. Il serait plus difficile à faire des bêtises !

Comment on précise un type ? Voici quelques exemples: 
* [Déclaration basique pour reprendre la structure de nos données](../../src/mysql/types/IUser.ts)
* [La structure des données pour faire une requête de type index avec pagination, et l'utilisation des génériques](../../src/mysql/types/IIndexQuery.ts)

### Le formatage des requêtes SQL

Comme toutes les librairies, on évite l'injection SQL en utilisant des fonctionnalités pour échapper les données :

```ts
// On met les ?, puis on passe comme 2ème paramètre un tableau des données à injecter, dans l'ordre
const data = await db.query<IUserRO[] & RowDataPacket[]>("select userId, familyName, givenName, email from user limit ? offset ?", [limit, offset]);      
```

Pour les inserts, il est pratique de passer plutôt un objet, et laisser la librairie formuler la requête :

```ts
const user: IUser = {
  email: "kevin@nguni.fr",
  familyName: "Glass",
  givenName: "Kevin",
}
const data = await db.query<OkPacket>("insert into user set ?", user);
```

# Exercice 1 : CRUD

Complétez les autres fonctions CRUD pour un utilisateur : 
* `GET /user/<userId>` : récupérer juste la ligne de l'utilisateur en format `IUser`
* `PUT /user/<userId>` : mettre à jour une ligne précise
* `DELETE /user/<userId>` : supprimer l'utilisateur


# Exercice 2 : Erreurs

Essayez de rentrer des mauvaises informations via Postman :
* Créer un utilisateur doublon
* Essayer de passer un champ qui n'est pas une colonne dans la base
* Passer du texte dans le query param de la requête index (pour limit et offset)
* Afficher, mettre à jour, ou supprimer un utilisateur qui n'existe pas

Pour l'instant, on reçois un message moche (pas en json) et pas très parlant dans Postman.

Ajoutez un middleware qui gère les erreurs :
* Renvoyez plutôt du json
* Avoir au moins le champs suivants :
  * `code` : le code HTTP approprié
    * `400` : la requête est mauvaise (erreur dans les données entrantes)
    * `401` : pas autorisé
    * `404` : élément pas trouvé
    * `500` : erreur interne (dernier recours)
  * `structured` : un champ plus libre mais plus structuré qui permettrait de localiser l'erreur coté front. Exemple : 
    * `params-invalid` 
    * `connection-error`
    * `auth/unknown-email`
  * `message`: un message humain décrivant l'erreur
  * `data`: (optionnel) les données supplémentaires concernant l'erreur

Astuce : il faut dire à express d'utiliser votre handler d'erreur avec `app.use(...)`. Votre handler doit avoir 4 paramètres dans le callback, le premier étant l'objet d'erreur.

# Exercice 3 : Factoring

Essayez d'ajouter une autre table à votre base, e.g. `repas`(vous pouvez vous inspirer de l'application nutrition).

Ajoutez des endpoints CRUD pour cette table. 

Essayez au maximum de factoriser votre code. Est-ce qu'il y a des éléments qu'on peut réutiliser pour les opération CRUD classiques ?


# Exercice 4 : Autorisation

Ajoutez une première couche d'identification et autorisation à votre API.

* Ajoutez une colonne "password" à la table `user`.
* Ajoutez la possibilité de renseigner un mot de passe et le stocker en format crypté (utilisez la librairie [`bcrypt.js`](https://github.com/dcodeIO/bcrypt.js)). L'idée est qu'on génère un hash avec bcrypt qui est stocké dans la base de données. Quand un utilisateur se connect, on recalcule le hash du mot de passe passé et le compare avec celui dans notre base. C'est ainsi qu'on se protège si jamais notre base est hacké, car on ne stocke pas des mots de passes en text clair.
* Ajoutez un endpoint `POST /auth/login` qui permet de se connecter en renseignant son adresse e-mail et son mot de passe. La réponse devrait fournir un `JWT` crée avec la librairie [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken). Votre JWT doit être signé par une clé privé (`RS256`), comme ça on est sur que le JWT a été crée par vous même (quand la clé et repassé comme jeton de validation). [Voici comment générer la clé privée](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). Il faut ensuite charger cette clé avec `fs` afin de l'utiliser dans la signature du JWT. Est-ce qu'on le charge à chaque requête ou on peut optimiser notre code ?
* Créez un middleware qui protège les endpoints CRUD pour la table `user` et `repas`. Le middleware doit regarder le header `authorization` qui devrait contenir le text `Bearer <JWT>`. Le middleware doit décrypter le token, le valider, et si invalide, renvoyer une erreur avec code `401`
* Configurer Postman pour récupérer le JWT automatiquement (grâce à des variables et un script) pour les endpoints protégés.
* Ajoutez le endpoint `GET /auth/requestPasswordReset` qui demande d'envoyer un mail de changement de mot de passe. Ce mail doit envoyer un code unique et utilisable une seul fois à l'adresse email précisé par l'utilisateur (vous pouvez créer un compte gratuit de Mailjet et intégrer la librairie [`node-mailjet`](https://github.com/mailjet/mailjet-apiv3-nodejs#readme)). 
* Ajoutez le endpoint `POST /auth/resetPassword` qui prend dans le corps du message le code unique envoyé par email, l'adresse e-mail et le nouveau mot de passe de l'utilisateur, et qui met à jour son mot de passe.


:closed_lock_with_key: :closed_lock_with_key: :closed_lock_with_key: Félicitations, vous avez sécurisé votre api ! :closed_lock_with_key: :closed_lock_with_key: :closed_lock_with_key:

# Exercice 5 : Autorisation magique

Dans vos challenges vous avez pu vous connecter juste en renseignant votre adresse email (sans mot de passe). Un mail avec un code est envoyé à votre boîte mail. Quand on clique dessus on est considéré autorisé.

Mettez en place ce flux avec les contraintes suivantes :
* Le lien dans le mail doit avoir un timeout de 5 minutes, au delà de cette intervalle, il faut retourner une erreur comme quoi il faut redemander un nouveau mail.
* On ne doit pas pouvoir acceder aux autres endpoints dans notre API avec le jeton dans le mail. En effet il faut que le jeton de connexion magique soit uniquement pour générer le jeton d'accès final

