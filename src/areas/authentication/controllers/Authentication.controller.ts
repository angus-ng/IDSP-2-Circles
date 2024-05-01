import express, { NextFunction, Request, Response } from "express";
import IController from "../../../interfaces/controller.interface";
import { IAuthenticationService } from "../services/IAuthentication.service";
import EmailAlreadyExistsException from "../../../exceptions/EmailAlreadyExists";
import passport from "passport";
import WrongCredentialsException from "../../../exceptions/WrongCredentialsException";
import path from "node:path";
import { User } from "@prisma/client";

class AuthenticationController implements IController {
  public path = "/auth";
  public router = express.Router();
  private _service: IAuthenticationService;
  constructor(service: IAuthenticationService) {
    this.initializeRoutes();
    this._service = service;
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/register`, this.showRegistrationPage);
    this.router.post(`${this.path}/register`, this.registration);
    this.router.get(`${this.path}/login`, this.showLoginPage);
    this.router.post(`${this.path}/login`, this.localCb, (req:express.Request, res:express.Response) => {});
    this.router.get(`${this.path}/logout`, this.logout);
    this.router.get(`${this.path}/facebook`, this.facebook), (req:express.Request, res:express.Response) => {};
    this.router.get(`${this.path}/facebook/callback`, this.facebookCb), (req:express.Request, res:express.Response) => {};
    this.router.get(`${this.path}/google`, this.google), (req:express.Request, res:express.Response) => {};
    this.router.get(`${this.path}/google/callback`, this.googleCb), (req:express.Request, res:express.Response) => { 
      res.redirect('/');};
  }

  private showLoginPage = (_: express.Request, res: express.Response) => {
    // if(res.locals.currentUser) {
    //   console.log("hello")
    //   res.redirect("/") // post
    //   return
    // }
    res.render(path.join(__dirname, "../views/login"));
  };

  private localCb = passport.authenticate("local", {
    successRedirect: "/", // post
    failureRedirect: '/auth/login'
  })

  private showRegistrationPage = (_: express.Request, res: express.Response) => {
    if(res.locals.currentUser) {  
      res.redirect("/") // post
      return
    } 
    res.render(path.join(__dirname, "../views/register"));
  };

  private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userProfile = req.body;
    
    try {
      const user = await this._service.findUserByEmail(userProfile.email);
      if(!user) {
      
        await this._service.createUser(userProfile);
        res.redirect("/auth/login")
      
      } else {
        const error = new EmailAlreadyExistsException(userProfile.email)
        const errorMessage = error.message;
        res.render("authentication/views/register", { errorMessage });
        throw error;
      }
    } catch (err) {
      next(err);
    }
  };
  
  private logout = async (req: express.Request, res: express.Response) => {
    req.logout((err) => {
      if (err) console.log(err);
    });
    res.redirect("/auth/login")
  };

  private facebook = passport.authenticate("facebook")

  private facebookCb = passport.authenticate('facebook', { 
    successRedirect: "/",
    failureRedirect: '/auth/login'
   })
   
  private google = passport.authenticate("google")

  private googleCb = passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: '/auth/login'
  })

}

export default AuthenticationController;