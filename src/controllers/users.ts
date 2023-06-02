import express, { Request, Response } from 'express';
import { User, getUsers,deleteUserById } from '../db/users';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: User[] = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.sendStatus(404);
    }

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
