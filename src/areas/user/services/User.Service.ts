import { User } from "@prisma/client";
import DBClient from "../../../PrismaClient";
import IUserService from "./IUserService";

export class UserService implements IUserService {
  readonly _db: DBClient = DBClient.getInstance();

  async friend(friend_1_name:string, friend_2_name:string) {
    try {
        await this._db.prisma.friend.create({
            data: {
                friend_1_name: friend_1_name,
                friend_2_name: friend_2_name
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }
  }

  async unfriend(friend_1_name: string, friend_2_name: string) {
    try {
        await this._db.prisma.friend.deleteMany({
            where: {
              friend_1_name: friend_1_name,
              friend_2_name: friend_2_name
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }
  }
  async getFriends(username: string): Promise<void | User[]> {
    if (!username) {
        return
      }
      try {
        const listOfFriendName = []
        const user = await this._db.prisma.user.findUnique({
          where: {
            username: username
          },
          include: {
            friends: {},
            friendOf: {}
          }
        })
        if (!user) {
            return 
        }
        for (let friend of user.friends) {
          listOfFriendName.push(friend.friend_2_name)
        }
        for (let friend of user.friendOf) {
          listOfFriendName.push(friend.friend_1_name)
        }

        const listOfFriends = []
        for (let username of listOfFriendName) {
          const user = await this._db.prisma.user.findUnique({
            where: {
              username: username
            }
          })
          listOfFriends.push(user)
        }
        //@ts-ignore
        return listOfFriends
      } catch (error) {
        throw new Error("Unable to find friends")
  
      }
  }
}
