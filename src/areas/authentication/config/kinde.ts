import {createKindeServerClient, GrantType, SessionManager} from "@kinde-oss/kinde-typescript-sdk";
import { Request, Response } from "express";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!
});

  
export const sessionManager = (req: Request, res: Response): SessionManager => ({
    async getSessionItem(key: string) {
    return req.session?.[key];
  },
  async setSessionItem(key: string, value: any) {
    req.session[key] = value;
  },
  async removeSessionItem(key: string) {
    delete req.session[key];
  },
  async destroySession() {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  },
  });