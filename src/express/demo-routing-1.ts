import Express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();


const loadUserStub = async (userId: string) => {
  // ex. "select userId from users where id = userId"
  return undefined;
}

const updateUserStub = async (userId: string, params: any) => {
  // ex. "update users set ...."
  return undefined;
}

// L'appli parse le corps du message entrant comme du json
app.use(json());

// Créer un endpoint POST
// On signal un paramètre qui existe dans le URL (:userId) avec un deux-point
app.post('/user/:userId/update', 
  
  // MIDDLEWARE 1 : Authorisation
  // A noter, dans express, les middlewares peuvent être async
  async (request: Request, response: Response, next: NextFunction) => {

    try {
      // Les query PARAMS sont disponibles sur l'objet request
      const userId = request.params.userId;
      if (!userId /* || user not in database */) {
        throw new Error("UserId not found!");
      }

      // ICI, valider l'autorisation
      response.locals.user = await loadUserStub(userId);

      // Si tout va bien, on appelle next() pour passer à l'étape 2
      next();

    } catch (err: any) {
      next(err);
    }
  },

  // MIDDLEWARE 2 : 
  async (request: Request, response: Response, next: NextFunction) => {
    
    try {
      // Mettre à jour les données
      await updateUserStub(response.locals.user, request.body);

      next();
    } catch (err: any) {
      next(err);
    }

  },

  // HANDLER FINAL : 
  async (request: Request, response: Response, next: NextFunction) => {
    response.json({
      id: response.locals.userId,
      ok: "true",
      debug:  {
        headers: request.headers,
        body: request.body,
        params: request.params,
        query: request.query
      }
    });
  },

);


// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);


