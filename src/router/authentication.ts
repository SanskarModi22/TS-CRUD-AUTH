import express, { Router, Request, Response } from 'express';
import { register,login } from '../controllers/authentication';

export default (router: Router): void => {
  router.post('/auth/register', (req: Request, res: Response): void => {
    register(req, res).catch((error: Error): void => {
      console.error(error);
      res.sendStatus(400);
    });
  });

  
  router.get('/auth/login', (req: Request, res: Response): void => {
    login(req, res).catch((error: Error): void => {
      console.error(error);
      res.sendStatus(400);
    });
  });


};
