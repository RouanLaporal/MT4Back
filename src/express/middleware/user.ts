import { NextFunction, Request, Response, Router} from "express";
import { authorizeUser } from './authorize-user.middleware';


// Index des utilisateurs

const routerIndex = Router({ mergeParams: true });

routerIndex.get('/',
  async (request: Request, response: Response, next: NextFunction) => {
    // Retourner une liste d'utilisateurs, avec pagination par exemple
    response.json({ 
      type: 'index',
      query: request.query
    });
  }
);

// Affichage / Manipulation d'un utilisateur

const routerSimple = Router({ mergeParams: true });

// Peut-être sous /:userId il faut passer un middleware d'autorisation avant de manipuler les données
routerSimple.use(authorizeUser());

routerSimple.get('/', 
  async (request: Request, response: Response, next: NextFunction) => {
    // Retourner la fiche utilisateur pour :userId

    response.json({ 
      type: 'get',
      params: request.params,
      query: request.query,      
    });
  }
)

routerSimple.put('/', 
  async (request: Request, response: Response, next: NextFunction) => {

    // Mettre à jour la fiche utilisateur pour :userId
    
    response.json({ 
      type: 'put',
      params: request.params,
      query: request.query,      
      body: request.body
    });
  }
);

routerSimple.delete('/', 
  async (request: Request, response: Response, next: NextFunction) => {

    // Supprimer
    
    response.json({ 
      type: 'put',
      params: request.params,
      query: request.query,      
    });
  }
)


// Regroupé

const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);
routerUser.use('/:userId', routerSimple);

export const ROUTES_USER = routerUser;