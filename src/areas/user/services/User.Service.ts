import { User } from "@prisma/client";
import DBClient from "../../../PrismaClient";
import IUserService from "./IUserService";
import Activies from "./../../../interfaces/activities.interface";

export class UserService implements IUserService {
  readonly _db: DBClient = DBClient.getInstance();

  async friend(requester:string, requestee:string) {
    try {
        const friendRequest = await this._db.prisma.friendRequest.findUnique({
            where: {
              requesterName_requesteeName: {
                requesteeName: requester,
                requesterName: requestee
              },
              status: false
            }
        })
        if (friendRequest) {
          await this.acceptRequest(requestee, requester)
        } else {
          await this._db.prisma.friendRequest.create({
            data: {
              requesteeName: requestee,
              requesterName: requester,
              status: false
            }
          })
        }
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
  async getActivities(username: string): Promise<void | Activies> {
    try {
      const friendRequests = await this._db.prisma.friendRequest.findMany({
        where: {
          requesteeName: username,
          status: false
        }, include: {
          requester: {}
        }
      })
      const circleInvites = await this._db.prisma.circleInvite.findMany({
        where: {
          invitee_username: username
        }, include: {
          circle: {}
        }
      })
      const albumInvites = await this._db.prisma.albumInvite.findMany({
        where: {
          invitee_username: username
        }, include: {
          album: {
            include: {
              circle: {}
            }
          }
        }
      })
      const activities:Activies = {
        friendRequests: friendRequests,
        circleInvites: circleInvites,
        albumInvites: albumInvites
      }
      return activities
    } catch (error: any) {
      throw new Error(error)
    }
  }
  async acceptRequest(requester: string, requestee: string): Promise<void> {
    try {
      const friendRequest = await this._db.prisma.friendRequest.findUnique({
          where: {
              requesterName_requesteeName: {
                requesteeName: requestee,
                requesterName: requester
              },
              status: false
          }
      })
      if (friendRequest) {
          await this._db.prisma.friendRequest.delete({
            where: {
              requesterName_requesteeName: {
                requesteeName: requestee,
                requesterName: requester
              }
          }
          })
          await this._db.prisma.friend.create({
              data: {
                  friend_1_name: requestee,
                  friend_2_name: requester
              }
          })
          await this._db.prisma.friend.create({
            data: {
                friend_1_name: requester,
                friend_2_name: requestee
            }
        })
          return
      } else {
          throw new Error("You have not been friend requested by this user")
      }
    } catch (error:any) {
      throw new Error(error)
    }
  }
  async search(input: string, currentUser: string): Promise<User[]> {
    try {
      const userSearchResults = await this._db.prisma.user.findMany({
        where:{
          username: {
            contains: input
          },
        }, include: {
          friendOf: {},
          friends: {}
        }
      })
      return userSearchResults
      //return users
    } catch (error:any) {
      throw new Error(error)
    }
  }
}
