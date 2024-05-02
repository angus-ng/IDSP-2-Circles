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
  async getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined> {
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
    } catch (error:any) {
      throw new Error(error)
    }
  }
  async createUser(user: UserDTO): Promise<User | null> {
    try {
      let checkEmail;
    if (user.email) {
         checkEmail = await this._db.prisma.user.findUnique({where : {email: user.email}}) 
    }
    const checkUsername =  await this._db.prisma.user.findUnique({where : {username : user.username}})
      if (checkEmail) {
        throw new Error(`The email ${ user.email } existed ❌`);
      } else if (checkUsername) {
        throw new Error(`The username ${ user.username } existed ❌`);
      }
      if (user.password){
        user.password = await hash(user.password, salt);
      }
  
      const User = await this._db.prisma.user.create({
        data: { 
          id: randomUUID(),
          ...user,
          profilePicture: "",
        }
      })
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

    let profilePicture = "";
    if (profile.photos) {
      profilePicture = profile.photos[0].value
    }

    const newUser = await this._db.prisma.user.create({
      data: {
        username: profile.displayName,
        facebookId: profile.id,
        profilePicture
      }
    })
    return newUser;
  }

  async findOrCreateGoogle(profile: Profile) {
    const user = await this._db.prisma.user.findUnique({
      where: {
        googleId: profile.id
      }
    });

    if (user) {
      return user;
    }

    const newUser = await this._db.prisma.user.create({
      data: {
        username: profile.displayName,
        googleId: profile.id,
        profilePicture: profile._json.picture
      }
    })
    return newUser;
  }
}