import express from 'express';
import { Request, Response } from 'express';
import Joi from 'joi'; // Importing Joi for input validation
import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  OK: 200,
};

// Define the schema for request body validation using Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
  try {
    // Validate the request body against the defined schema
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      // Return a 400 Bad Request status if validation fails
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
    }

    const { email, password, username } = value;

    // Check if a user with the same email already exists in the database
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Return a 400 Bad Request status if the user already exists
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
    }

    // Generate a random salt and hash the password
    const salt = random();
    const hashedPassword = authentication(salt, password);

    // Create a new user with the validated data and hashed password
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: hashedPassword,
      },
    });

    // Return the created user as JSON with a 200 OK status
    return res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    console.log(error);
    // Return a 400 Bad Request status if any error occurs during registration
    return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
  }
};
