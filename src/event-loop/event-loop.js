const fs = require("fs");
const path = require("path");

const FICHIER = path.join(__dirname, '..', '..', 'docs', 'media', 'grunter.JPG');

// Chargement synchrone
console.time("Load file");
fs.readFileSync(FICHIER);
console.timeEnd("Load file");


// Chargement asynchrone en utilisant le event-system
console.time("Load file async");
fs.readFile(FICHIER, 
  // 2ème paramètre le "callback", la fonction à appeler quand le fichier est prêt
  // Ici, on utilise une fonction "flèche" (arrow function)
  (err) => {
    if (err) {
      console.err(err.message);
      return;
    }

    // Faire quelques choses avec le fichier
    console.log("File loaded!");
  }
);
console.timeEnd("Load file async");

console.log("Starting up loader...");