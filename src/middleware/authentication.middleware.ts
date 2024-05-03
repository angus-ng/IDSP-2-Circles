import { NextFunction, Request, Response } from "express";

export const ensureAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  if (req.isAuthenticated()) {
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