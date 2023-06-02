import express from 'express';
import { Request, Response } from 'express';
import Joi from 'joi'; // Importing Joi for input validation
import { getUserByEmail, createUser,User } from '../db/users';
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

export const register = async (req: Request, res: Response) : Promise<void>=> {
  try {
    // Validate the request body against the defined schema
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      // Return a 400 Bad Request status if validation fails
       res.sendStatus(HTTP_STATUS.BAD_REQUEST);
       return ;
    }

    const { email, password, username } = value;

    // Check if a user with the same email already exists in the database
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Return a 400 Bad Request status if the user already exists
      res.sendStatus(HTTP_STATUS.BAD_REQUEST);
      return;
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
     res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    console.log(error);
    // Return a 400 Bad Request status if any error occurs during registration
    res.sendStatus(HTTP_STATUS.BAD_REQUEST);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // If email or password is missing, send a Bad Request status
      res.sendStatus(HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Find the user by email and select additional fields (salt, password)
    const user: User | null = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    console.log(user);
    if (!user) {
      // If user doesn't exist, send a Bad Request status
      res.sendStatus(HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Compare the hashed password with the expected hash
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      // If password doesn't match, send a Forbidden status
      res.sendStatus(403);
      return;
    }

    // Generate a new session token and update it in the user object
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    // Save the updated user object
    await user.save();

    // Set the session token as a cookie
    res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    // Send the user object as JSON with an OK status
    res.status(HTTP_STATUS.OK).json(user).end();
  } catch (error) {
    console.log(error);
    // If an error occurs, send a Bad Request status
    res.sendStatus(HTTP_STATUS.BAD_REQUEST);
  }
};