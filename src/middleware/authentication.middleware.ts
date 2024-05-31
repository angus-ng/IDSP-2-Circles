import { kindeClient, sessionManager } from "../areas/authentication/config/kinde";
import { NextFunction, Request, Response } from "express";

export const ensureAuthenticated = async (req:Request, res:Response, next:NextFunction) => {
  if (await kindeClient.isAuthenticated(sessionManager(req,res))) {
    return next();
  }
  res.redirect("/");
  return
};

export const forwardAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  return next();
};

export const setCurrentUser = (req:Request, res:Response, next:NextFunction) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
  }
  next();
};