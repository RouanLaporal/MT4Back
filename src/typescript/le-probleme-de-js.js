// JS est très permissive, on peut faire n'importe quoi ...

let a = "hello";
a = 3;

console.log(a);

// Les objets ne sont pas strictement définis

const response = {
  greetingg: "Hello",
  audience: "World",
  number: 123
}

// On peut ajouter des valeurs sans problème
response.d = 567;

// Code-refactore est plus compliqué

response.greetingg = 5;       // Erreur d'orthographe, comment faire pour corriger ?


// Pas de validation des données avant l'éxécution

var request;
const body = request.body;

// ... et si address était null ?
if (body.address.city === "Paris") {

}