import Express, { json } from "express";
import { ROUTES_USER } from './routes/auth/user';
import { DefaultErrorHandler } from './middleware/error-handler';
import { ROUTES_CHALLENGE } from './routes/challenge';

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use('/auth/user', ROUTES_USER);

app.use('/challenge', ROUTES_CHALLENGE);

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);


// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);


