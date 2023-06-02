import express, { Request, Response } from 'express';
import { User, getUsers } from '../db/users';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: User[] = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
