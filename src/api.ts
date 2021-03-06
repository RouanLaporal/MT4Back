import Express, { json } from "express";
import { DefaultErrorHandler } from './middleware/error-handler';
// import { ROUTES_CHALLENGE } from './routes/challenge';
import { ROUTES_VALIDATION } from "./routes/validation";
import { RegisterRoutes } from './routes/routes';
import { ROUTES_PARTICIPATION } from "./routes/participation";
//import { ROUTES_SSH } from './routes/auth/ssh';

import swaggerUi from "swagger-ui-express";
const { Client } = require('ssh2');
const { readFileSync } = require('fs');
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

RegisterRoutes(app);

app.use(Express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);


//app.use('/auth/ssh', ROUTES_SSH)

// app.use('/challenge', ROUTES_CHALLENGE);

app.use('/validation', ROUTES_VALIDATION);


app.use('/participation', ROUTES_PARTICIPATION)

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);


// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);


