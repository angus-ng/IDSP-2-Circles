import DBClient from "../../../PrismaClient";
import ICircle from "../../../interfaces/circle.interface";
import IUserService from "./IUserService";
import { Circle, User } from '@prisma/client'

export class UserService implements IUserService {
  readonly _db: DBClient = DBClient.getInstance();

  async follow(followerName:string, followingName:string) {
    try {
        await this._db.prisma.follows.create({
            data: {
                followerName: followerName,
                followingName: followingName
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }
  }

  async unfollow(followerName: string, followingName: string) {
    try {
        await this._db.prisma.follows.deleteMany({
            where: {
                followerName: followerName,
                followingName: followingName
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }
  }
  async getFollowers(followingName: string): Promise<void | User[]> {
      this._db.prisma.follows.findMany({
        where:{
            followingName:followingName
        }, include: {
            follower:{}
        }
      })
  }
  async getFollowing(followerName: string): Promise<void | User[]> {
      
  }
}
