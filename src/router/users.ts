import express from "express";
import { Router, Request, Response } from "express";
import { getAllUsers } from "../controllers/users";
import { isAuthenticated } from "../middlewares";

export default (router: Router): void => {
  router.get("/users", isAuthenticated, (req: Request, res: Response): void => {
    getAllUsers(req, res).catch((error: Error): void => {
      console.error(error);
      res.sendStatus(400);
    });
  });
};
