import express, { NextFunction, Request, Response } from "express";
import IController from "../../../interfaces/controller.interface";
import { IAuthenticationService } from "../services/IAuthentication.service";
import { kindeClient, sessionManager } from "../config/kinde";
import { User as IUser } from "@prisma/client";
import { wss } from "../../../app";
import { initializeWs } from "../../../helper/websocket";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

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
    this.router.get(`${this.path}/login`, this.login);
    this.router.get(`${this.path}/register`, this.register);
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
        username: kindeUser.given_name + kindeUser.family_name + Math.floor(Math.random()*100000),
        firstName: kindeUser.family_name,
        lastName: kindeUser.given_name,
        profilePicture: kindeUser.picture || "/placeholder_image.svg",
        displayName: kindeUser.given_name + kindeUser.family_name
      })
    }
    //@ts-ignore
    req.user = user
    initializeWs()

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
        const kindeUser = await kindeClient.getUser(sessionManager(req, res))
        const user = await this._service.getUserById(kindeUser.id)
        res.json({success: true, username: user?.username})
      }
      // make this return the user family name igven name picture email id whatvere u want or make user make a new name.
    } catch (error) {
      res.json({success: false, errorMessage: "Not logged in"})
    }
  }
}

export default AuthenticationController;