import express, { NextFunction, Request, Response } from "express";
import IController from "../../../interfaces/controller.interface";
import { IAuthenticationService } from "../services/IAuthentication.service";
import passport from "passport";
import path from "node:path";
import { User } from "@prisma/client";
import { kindeClient, sessionManager } from "../config/kinde";


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
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/local`, this.local)
    this.router.get(`${this.path}/login`, this.login);
    this.router.get(`${this.path}/register`, this.register);
    this.router.get(`${this.path}/facebook`, this.facebook)
    this.router.get(`${this.path}/facebook/callback`, this.facebookCb);
    this.router.get(`${this.path}/google`, this.google);
    this.router.get(`${this.path}/google/callback`, this.googleCb)
    this.router.get(`${this.path}/callback`, this.callback)
    this.router.get(`${this.path}/logout`, this.logout)
  }

  private login = async (req:Request, res:Response) => {
    const loginUrl = await kindeClient.login(sessionManager(req, res));
    return res.redirect(loginUrl.toString());
  }

  private register = async (req: Request, res: Response) => {
    const registerUrl = await kindeClient.register(sessionManager(req, res));
    return res.redirect(registerUrl.toString());
  }

  private callback = async (req: Request, res: Response) => {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
    await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
    const kindeUser = await kindeClient.getUser(sessionManager(req, res))
    let user = await this._service.getUserById(kindeUser.id)
    if (!user) {
      //@ts-ignore
      user = await this._service.createUser({
        id: kindeUser.id,
        username: kindeUser.id,
        firstName: kindeUser.family_name,
        lastName: kindeUser.given_name,
        profilePicture: kindeUser.picture || ""
      })
    }
    //@ts-ignore
    req.user = user
    return res.redirect("/");
  }

  private logout = async (req: Request, res: Response) => {
      const logoutUrl = await kindeClient.logout(sessionManager(req, res));
      return res.redirect("/");
  }

  private getSession = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        res.json({success: true, username: req.user?.username})
      } else {
        const user = await kindeClient.getUser(sessionManager(req, res))
        res.json({success: true, username: user.id})
      }
      // make this return the user family name igven name picture email id whatvere u want or make user make a new name.
    } catch (error) {
      res.json({success: false, errorMessage: "Not logged in"})
    }
  }

  private local = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    passport.authenticate("local", function(err: any, user: any, info: any) {
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