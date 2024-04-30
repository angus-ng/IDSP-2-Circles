import express, { Request, Response } from "express";
import IController from "../../../interfaces/controller.interface";
import { IAuthenticationService } from "../services/IAuthentication.service";
import EmailAlreadyExistsException from "../../../exceptions/EmailAlreadyExists";
import passport from "passport";
import WrongCredentialsException from "../../../exceptions/WrongCredentialsException";
import path from "node:path";

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
    this.router.post(`${this.path}/login`, this.login, (req, res) => {
      res.redirect("/posts")
    });
    this.router.get(`${this.path}/logout`, this.logout);
    this.router.get(`${this.path}/facebook`, this.facebook), (req:express.Request, res:express.Response) => {

    };
    this.router.get(`${this.path}/facebook/callback`, this.facebookCb), (req:express.Request, res:express.Response) => {
    };
  }

  private showLoginPage = (_: express.Request, res: express.Response) => {
    console.log("hello")
    if(res.locals.currentUser) {  
      res.redirect("/posts")
      return
    }
    res.render(path.join(__dirname, "../views/login"));
  };

  private showRegistrationPage = (_: express.Request, res: express.Response) => {
    if(res.locals.currentUser) {  
      res.redirect("/posts")
      return
    } 
    res.render(path.join(__dirname, "../views/register"));
  };

  private login = passport.authenticate("local", {
  successRedirect: "/posts",  
  failureRedirect: "/auth/login",
  failureMessage: true,
  })

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

  
}

export default AuthenticationController;
