import express, { Request, Response } from 'express';
import { User, getUsers,deleteUserById ,getUserById , updateUserById} from '../db/users';

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

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user: User | null = await getUserById(id);

    if (!user) {
      return res.sendStatus(404); // Return a 404 status code if the user with the provided 'id' is not found
    }

    const updatedUser: User | null = await updateUserById(id, { username });

    if (!updatedUser) {
      return res.sendStatus(500); // Return a 500 status code if the user update fails
    }

    return res.status(200).json(updatedUser).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
