import { sessionManager } from "../areas/authentication/config/kinde";
import { kindeClient } from "../areas/authentication/config/kinde";
import { Request, Response } from "express";

export async function getLocalUser(req:Request, res:Response) {
    let loggedInUser
    if (req.user) (
        loggedInUser = req.user!.username
    )
    if (!loggedInUser) {
        loggedInUser = (await kindeClient.getUser(sessionManager(req, res))).id
    }
    console.log(loggedInUser)
    return loggedInUser
}