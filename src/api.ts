import Express, { json } from "express";
import { ROUTES_USER } from './routes/auth/user';
import { DefaultErrorHandler } from './middleware/error-handler';
import { ROUTES_CHALLENGE } from './routes/challenge';
import { ROUTES_SCORE } from "./routes/score";
import { ROUTES_PROMO } from './routes/promo';
import { ROUTES_SSH } from './routes/auth/ssh';
import { signup } from "./middleware/authorization";

const cors = require('cors');
// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();
app.use(cors({
  origin: '*'
}));

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use('/auth/user', ROUTES_USER);

app.use('auth/ssh', ROUTES_SSH)

app.use('/challenge', ROUTES_CHALLENGE);

app.use('/score', ROUTES_SCORE);

app.use('/promo', ROUTES_PROMO);

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);


// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);


