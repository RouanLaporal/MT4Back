import Express, { json } from "express";
import { ROUTES_USER } from './routes/auth/user';
import { DefaultErrorHandler } from './middleware/error-handler';
import { ROUTES_CHALLENGE } from './routes/challenge';
import { ROUTES_SCORE } from "./routes/score";
import { ROUTES_PROMO } from './routes/promo';
import { ROUTES_SSH } from './routes/auth/ssh';
import { authorization } from "./middleware/authorization";

const cors = require('cors');
// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();
app.use(cors({
  origin: '*',
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use('/auth/user', ROUTES_USER);

app.use('/auth/ssh', ROUTES_SSH)

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


