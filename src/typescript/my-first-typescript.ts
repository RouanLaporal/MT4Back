
console.log("This is my first Typescript file");

// A noter, on précise les types par : [string|number|boolean|any ou autres]
const prenom: string = "Kevin";
const nom: string = "Glass";
const age: number = 40;
const etudiant: boolean = false;

// A noter, on précise le type des paramètres aussi
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet(prenom, new Date());

// Définir une "interface" qui est une définition d'un objet
interface IRequest {
  type: 'POST' | 'GET';   // On peut énumérer des valeurs possibles
  orderBy?: string;       // Un point d'intérrogation rend le champ optionnel
  limit?: number;
  page?: number;
}

const req: IRequest = {
  type: 'POST',
  orderBy: 'title',
  page: 1
}

// On peut définir explicitement des types
type ActionState = 'pending' | 'busy' | 'done' | 'canceled';

const state: ActionState = 'done';


/* 
On peut définir des types pour les fonctions 
Dans cet example, le callback passe un ActionStates comme paramètre et attend un retour de type IRequest
*/
type CallbackFunction = (state: ActionState) => IRequest;

const SendRequest = (cb: CallbackFunction) => {

  const req = cb('pending');

  // ... envoyez la reqêuet
}

SendRequest(
  (state) => {    
    return {
      type: (state === 'pending' ? 'POST' : 'GET'),
      page: 1
    }
  }
)
