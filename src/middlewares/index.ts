import express, { Request, Response, NextFunction } from "express";
import { getUserBySessionToken, User } from "../db/users";

import { get } from "lodash";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionToken = req.cookies["ANTONIO-AUTH"];

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

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params; // Extract the 'id' parameter from the request parameters
    const currentUserId = get(req, "identity._id") as string; // Get the current user's ID from the 'req.identity._id' property using lodash's 'get' function

    if (!currentUserId) {
      // If currentUserId is not available (falsy), indicating user is not authenticated or identity information is missing
      return res.sendStatus(400); // Send a 400 status code (Bad Request) as the response
    }

    if (currentUserId !== id) {
      // If currentUserId exists but does not match the 'id' parameter, indicating the current user is not the owner of the resource
      return res.sendStatus(403); // Send a 403 status code (Forbidden) as the response
    }

    next(); // If both checks pass, pass control to the next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // If any error occurs, log the error and send a 500 status code (Internal Server Error) as the response
  }
};
