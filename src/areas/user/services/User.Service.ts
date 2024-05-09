import { User } from "@prisma/client";
import DBClient from "../../../PrismaClient";
import IUserService from "./IUserService";

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
  async getFollowers(followingName: string): Promise<void | string[]> {
    if (!followingName) {
        return
      }
      try {
        const listOfFollowings = []
        const user = await this._db.prisma.user.findUnique({
          where: {
            username: followingName
          },
          include: {
            following: {}
          }
        })
        if (!user) {
            return 
        }
        for (let follower of user.following) {
          listOfFollowings.push(follower.followerId)
        }
        return listOfFollowings
      } catch (error) {
        throw new Error("Unable to find followings")
      }
  }
  async getFollowing(followerName: string): Promise<void | string[]> {
    if (!followerName) {
        return
      }
      try {
        const listOfFollowings = []
        const user = await this._db.prisma.user.findUnique({
          where: {
            username: followerName
          },
          include: {
            followers: {}
          }
        })
        if (!user) {
            return 
        }
        for (let following of user.followers) {
          listOfFollowings.push(following.followingId)
        }
        return listOfFollowings
      } catch (error) {
        throw new Error("Unable to find followings")
  
      }
  }
}
