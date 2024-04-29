import DBClient from "../../../PrismaClient";
import { IAuthenticationService, UserDTO } from "./IAuthentication.service";
import { compare, hash } from "bcrypt"
// import type { User } from "@prisma/client";
import User from "../../../interfaces/user.interface";
import { randomUUID } from "crypto";
const salt = 12

export class AuthenticationService implements IAuthenticationService {
  readonly _db: DBClient = DBClient.getInstance();

  async findUserByEmail(email: string): Promise<User | null> {
    return await this._db.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this._db.prisma.user.findUnique({
        where: {
          email : email,
        }
    })
      if(await compare(password, user.password)) {
        return user
      }
      throw new Error("Password incorrect")
    } catch (error) {
      throw new Error("No email in our database")
    }
  }
  async createUser(user: UserDTO): Promise<User | null> {
    const checkEmail = await this._db.prisma.user.findUnique({where : {email: user.email}})
    const checkUsername = await this._db.prisma.user.findUnique({where : {username : user.username}})
    try {
      if (checkEmail) {
        throw new Error(`The email ${ user.email } existed ❌`);
      } else if (checkUsername) {
        throw new Error(`The username ${ user.username } existed ❌`);
      }
      user.password = await hash(user.password, salt);
  
      const newUser: User = {
        id: randomUUID(),
        ...user,
      }
  
      const User = await this._db.prisma.user.create({data: newUser})
      console.log(User)
      return User
    } catch (error) {
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
    return await this._db.prisma.user.findUnique({where : {id : id}})
  }
}
