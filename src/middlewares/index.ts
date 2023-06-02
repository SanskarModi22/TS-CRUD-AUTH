import express, { Request, Response, NextFunction } from 'express';
import { getUserBySessionToken, User } from '../db/users';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionToken = req.cookies['ANTONIO-AUTH'];

    if (!sessionToken) {
      res.sendStatus(403);
      return;
    }

    const existingUser: User | null = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.sendStatus(403);
      return;
    }

    // Attach the user object to the request for downstream middleware or route handlers
    (req as any).identity = existingUser;

    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
};
