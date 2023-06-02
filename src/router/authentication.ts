import express, { Router, Request, Response } from 'express';
import { register } from '../controllers/authentication';

export default (router: Router): void => {
  router.post('/auth/register', (req: Request, res: Response): void => {
    register(req, res).catch((error: Error): void => {
      console.error(error);
      res.sendStatus(400);
    });
  });
};
