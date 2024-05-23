import { sessionManager } from "../areas/authentication/config/kinde";
import { kindeClient } from "../areas/authentication/config/kinde";
import { Request, Response } from "express";
import { UserService } from "../areas/user/services";
import { PrismaClient } from "@prisma/client";
import DBClient from "../PrismaClient";
const db = DBClient.getInstance()

export async function getLocalUser(req: Request, res: Response) {
    const kindeUserId = (await kindeClient.getUser(sessionManager(req, res))).id
    const user = await db.prisma.user.findUnique({
        where: { id: kindeUserId }
    })
    if (user) {
        return user?.username
    } else
        throw new Error("Not logged in")
}