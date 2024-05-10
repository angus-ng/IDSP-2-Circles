import express, { NextFunction, Request, Response } from "express";
import IController from "../../../interfaces/controller.interface";
import { IAuthenticationService } from "../services/IAuthentication.service";
import passport from "passport";
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
    this.router.get(`${this.path}/getSession`, this.getSession)
    this.router.get(`${this.path}/register`, this.showRegistrationPage);
    this.router.post(`${this.path}/register`, this.registration);
    this.router.get(`${this.path}/login`, this.showLoginPage);
    this.router.post(`${this.path}/local`, this.local)
    this.router.get(`${this.path}/logout`, this.logout);
    this.router.get(`${this.path}/facebook`, this.facebook)
    this.router.get(`${this.path}/facebook/callback`, this.facebookCb);
    this.router.get(`${this.path}/google`, this.google);
    this.router.get(`${this.path}/google/callback`, this.googleCb)
  }

  private getSession = (req:Request, res:Response) => {
    if(req.user) {  
      res.json({success: true, username: req.user!.username})
      return
    } 
    res.json({success: false, errorMessage: "Not logged in"})

  }

  private showLoginPage = (_: express.Request, res: express.Response) => {
    // if(res.locals.currentUser) {
    //   console.log("hello")
    //   res.redirect("/") // post
    //   return
    // }
    res.render(path.join(__dirname, "../views/login"));
  };

  private local = (req: express.Request, res:express.Response, next:express.NextFunction) => {
    passport.authenticate('local', function(err:any, user:any, info:any) {
      if (err || !user) {
        return res.status(200).json({success: true, data:null })
      }
      req.logIn(user, async function(err) {
        if (err) {
          return res.status(200).json({success: true, data:null})
        }
        res.status(200).json({success: true, data:req.user!.username})
      })
    })(req, res, next)
  }

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
        res.redirect("/")
      
      } else {
        const error = new Error(userProfile.email)
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
    res.redirect("/")
  };

  private facebook = passport.authenticate("facebook")

  private facebookCb = passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: '/'
  })
   
  private google = passport.authenticate("google")

  private googleCb = passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: '/'
  })

}

export default AuthenticationController;