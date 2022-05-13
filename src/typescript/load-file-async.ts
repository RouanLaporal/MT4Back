// De plus en plus de librairies incluent aussi une version des fonctions
// qui retournent des Promise. Il faut lire la documentation de la librairie en question
import { readFile } from "fs/promises";
import { join } from "path";

const FICHIER1 = join(__dirname, '..', '..', 'docs', 'media', 'grunter.JPG');
const FICHIER2 = join(__dirname, '..', '..', 'docs', 'media', 'fichier_qui_nexist_pas.png');
const FICHIER3 = join(__dirname, '..', '..', 'docs', 'media', 'devcontainer-popup.png');



const exec = async() => {
  try {
    // Si une fonction retourne un Promise, elle pourrait être utilisé avec await
    const buffer1 = await readFile(FICHIER1);
    console.log("Fichier 1 chargé !")

    const buffer2 = await readFile(FICHIER2);
    console.log("Fichier 2 chargé !")

    const buffer3 = await readFile(FICHIER3);

    // Tout le média chargé
    // Lancer le jeu !
  } catch (err) {
    console.error("Oups, il y a eu une erreur !");
  }

}

exec();

