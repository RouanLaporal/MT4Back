# Promise

Dans les versions anciennes de JS, on se trouvait souvent à dans la situation de "callback hell" ... c'est à dir, dans un callback, on fait encore une opération asynchrone, et ainsi de suite. Notre code ressemblait au suivant :

```js
var floppy = require('floppy');
floppy.load('disk',function(data) {
  floppy. load ('disk', function (data) {
    floppy. load ('disk', function(data) {
      floppy.load('disk',function(data) {
        floppy. load('disk', function (data) {
          floppy.load('disk',function(data) {
            floppy. load('disk', function (data)  {
              floppy.load('disk',function(data) {
              });
            });
          });
        });
      });
    });
  });
});
```

On a introduit le principe d'un Promise : 

> Un Promise est un objet qui pourrait produire soit une valeur dans le futur, soit une raison pourquoi elle n'aurait pas pu terminer.

Au lieu de passer par un callback on fait le suivant :

```js
const p = new Promise(
  (resolve, reject) => {

    // Effectuer votre logique, par exemple une requete serveur

    // Si OK
    if (ok) {
      resolve();
    } else {
      reject(error);
    } 
  }
)

// La Promise est un objet, avec 3 fonctions : "then", "catch" et "finally"
p
.then(
  (value) => {
      // Ce callback est exécuté quand "resolve" est appelé dans la Promise

      // Je pourrais retourner une nouvelle Promise pour les enchaîner...
      return new Promise(/* à remplir */);
  }
)
.then(
  () => {

  }
)
.catch(
  (err) => {
    // Si jamais "reject" est appelé, on saute tous les "then" et on vient directement ici pour gérer les erreurs
  }
)

```

Faites attention à retenir cette structure, parce que c'est la fondation pour la suite.

Nous allons entourer la lecture d'un fichier pas un promise en TypeScript :

[Exemple Promise](../../src/typescript/promise.ts)



## Async / await

Vous avez sûrement remarqué que ce n'est pas très propre cet enchaînement de

Enchaîner les "then" crée quand même du code chargé de callbacks, donc on a intégré du "syntactic sugar" (syntax sucré) qui permet d'exprimer une suite de Promise plus brièvement.

D'abord, on marque une fonction avec le mot clé `async` : 

```js
const myFunc = async () => {

  // Enchainer les promises dans la fonction async
  await AutrePromise();
  await AutrePromise()
  await AutrePromise()

}


// myFunc est un objet de type Promise, et on peut l'utiliser ainsi :

myFunc()
  .then(
    () => {

    }
  )
  .catch(
    () => {

    }
  )


```

Voici notre chargement de fichier modifié avec `async/await`.

Il y a 2 choses à retenir :
* En marquant une fonction `async`, on dit que notre fonction retourne un objet de type "Promise". Ceci se voit avec typescript et VSCode.
* Le mot clé `await` fait l'équivalent de ".then", et peut être utilisé sur toutes les Promises.

[Exemple Async Await](../../src/typescript/async-await.ts)

De plus en plus de librairies offre des alternatifs aux callbacks en utilisant les Promises. Par exemple : 

[Exemple Async Await - Promise Native](../../src/typescript/load-file-async.ts)


# Exercice

> Enveloppez la fonction "setTimeout" dans une fonction qui s'appelle "wait(seconds: number)", qui prend comme valeur le nombre de secondes à attendre avant de continuer.
>
> Ensuite utilisez cette fonction à plusieurs reprises afin rythmer bien l'emission des valeurs sur le stdout (le rythme de la symphonie n° 5 de Beethoven) : 
>
> Da - pause (0,33s) - Da - pause (0,33s) - Da - pause (0,33s) - Daaaaaaaaaa - pause (3s) etc.


# Next Steps

[Express](../express/express.md)