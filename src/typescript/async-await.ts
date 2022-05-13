/* En Typescript on importe les librairies avec "import" (et pas "require")
* Notez comment, en VSCode, on peut récupérer des informations et auto-complète sur les fonctions et objets
* grâce à TypeScript !
*/
import { readFile } from "fs";
import { join } from "path";

const FICHIER1 = join(__dirname, '..', '..', 'docs', 'media', 'grunter.JPG');
const FICHIER2 = join(__dirname, '..', '..', 'docs', 'media', 'fichier_qui_nexist_pas.png');
const FICHIER3 = join(__dirname, '..', '..', 'docs', 'media', 'devcontainer-popup.png');

// On peut transformer un API qui utilise les callbacks en promise

const loadFileAsync = (path: string): Promise<Buffer> => {
  // Setup le promise avec son callback "resolve" et "rejects"
  return new Promise<Buffer>(
    (resolve, reject) => {
      
      // Appelez la fonction où le 2ème paramètre est un callback traditionnel
      readFile(path, (err, data) => {
        // S'il y a une erreur, on rejette
        if (err) {
          reject(err);
        } else {
          // Sinon on resolve
          resolve(data)
        }
      });
  
    }
  );
}

/* On doit obligatoirement marquer une fonction avec "async" pour indiquer
que la fonction retourne une Promise (c'est implicite). A l'intérieure, on 
n'a juste à utiliser le mot clé "await" devant nos Promises, qui est l'équivalent 
à la clause ".then". 

Si on entoure le tout par try/catch, on retrouve la fonctionnalité de ".catch"
*/


const exec = async() => {
  try {
    const buffer1 = await loadFileAsync(FICHIER1);
    console.log("Fichier 1 chargé !")

    const buffer2 = await loadFileAsync(FICHIER2);
    console.log("Fichier 2 chargé !")

    const buffer3 = await loadFileAsync(FICHIER3);

    // Tout le média chargé
    // Lancer le jeu !
  } catch (err) {
    console.error("Oups, il y a eu une erreur !")
  }

}

exec();

