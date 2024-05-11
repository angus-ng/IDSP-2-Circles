import { User } from "@prisma/client";
import DBClient from "../../../PrismaClient";
import IUserService from "./IUserService";
import Activies from "./../../../interfaces/activities.interface";

export class UserService implements IUserService {
  readonly _db: DBClient = DBClient.getInstance();

  async friend(requester:string, requestee:string): Promise<string|void> {
    try {
        const exists = await this._db.prisma.friendRequest.findUnique({
          where: {
            requesterName_requesteeName: {
              requesteeName: requestee,
              requesterName: requester
            }
          }
        })
        if (exists) {
          return;
        }

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
          return await this.acceptRequest(requestee, requester)
        } 

        await this._db.prisma.friendRequest.create({
            data: {
              requesteeName: requestee,
              requesterName: requester,
              status: false
            }
          })
    } catch (error: any) {
        throw new Error(error)
    }
  }

  async unfriend(friend_1_name: string, friend_2_name: string): Promise<string|void> {
    try {
        await this._db.prisma.friend.delete({
          where: {
            friend_1_name_friend_2_name: {
              friend_1_name: friend_1_name,
              friend_2_name: friend_2_name
            }
          }
        })
        await this._db.prisma.friend.delete({
          where: {
            friend_1_name_friend_2_name: {
              friend_1_name: friend_2_name,
              friend_2_name: friend_1_name
            }
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
      const activities:Activies = {
        friendRequests: friendRequests,
        circleInvites: circleInvites,
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
  async removeRequest(user1: string, user2: string): Promise<void> {
    try {
      const friendRequestReceive = await this._db.prisma.friendRequest.findUnique({
        where: {
          requesterName_requesteeName: {
            requesteeName: user1,
            requesterName: user2
          },
          status: false
        }
    })
    const friendRequestSent = await this._db.prisma.friendRequest.findUnique({
      where: {
        requesterName_requesteeName: {
          requesteeName: user2,
          requesterName: user1
        },
        status: false
      }
    }) 
    if (friendRequestReceive) {
      await this._db.prisma.friendRequest.delete({
        where: {
          requesterName_requesteeName: {
            requesteeName: user1,
            requesterName: user2
          },
          status: false
        }
      })
    }
    if (friendRequestSent) {
      await this._db.prisma.friendRequest.delete({
        where: {
          requesterName_requesteeName: {
            requesteeName: user2,
            requesterName: user1
          },
          status: false
        }
      })
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
          friends: {},
          requestReceived: {
            include:{requester:{}}
          },
          requestsSent: {
            include:{requestee:{}}
          }
        }
      })
      return userSearchResults
      //return users
    } catch (error:any) {
      throw new Error(error)
    }
  }

  async getUser(username: string, currentUser: string): Promise<any> {
    if (username === currentUser) {
      const userInfo = await this._db.prisma.user.findUnique({
        select: {
          username: true,
          profilePicture: true,
          _count: {
            select: {
              friends: true,
              UserCircle: true
            }
          },
          UserCircle: {
            select: {
              circle: {
                select: {
                  name: true,
                  picture: true,
                  id: true
                }
              }
            }
          },
          Album: {
            include: {
              photos: true
            }
          }
        },
        where: {
          username: username
        }
      })
      return userInfo;
    }
    return null
  }
}
