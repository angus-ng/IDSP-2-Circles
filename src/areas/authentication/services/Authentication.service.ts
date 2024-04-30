import DBClient from "../../../PrismaClient";
import { IAuthenticationService, UserDTO } from "./IAuthentication.service";
import { compare, hash } from "bcrypt"
// import type { User } from "@prisma/client";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { Profile } from "passport-facebook";
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
    if (!user) {
      throw new Error("No email in our database")
    }
    if (user.password) {
      if(await compare(password, user.password)) {
        return user
      }
      throw new Error("Password incorrect")
    }
    } catch (error) {
      throw new Error("")
    }
  }
  async createUser(user: UserDTO): Promise<User | null> {
    try {
      let checkEmail;
    if (user.email) {
         checkEmail = await this._db.prisma.user.findUnique({where : {email: user.email}}) 
    }
    const checkUsername =  null //await this._db.prisma.user.findUnique({where : {username : user.username}})
      if (checkEmail) {
        throw new Error(`The email ${ user.email } existed ❌`);
      } else if (checkUsername) {
        throw new Error(`The username ${ user.username } existed ❌`);
      }
      if (user.password){
        user.password = await hash(user.password, salt);
      }
  
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

  async findOrCreateFB(profile: Profile) {
    const user = await this._db.prisma.user.findUnique({
      where: {
        facebookId: profile.id
      }
    });

    if (user) {
      return user;
    }

    const newUser = await this._db.prisma.user.create({
      data: {
        username: profile.id,
        profilePicture: "",
        facebookId: profile.id
      }
    })
    return newUser;
  }
}