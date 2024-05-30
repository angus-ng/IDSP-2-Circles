import { randomUUID } from "node:crypto";
import DBClient from "../../../PrismaClient";
import ICircle from "../../../interfaces/circle.interface";
import ICircleService from "./ICircleService";
import { Circle } from '@prisma/client'

export class CircleService implements ICircleService {
  readonly _db: DBClient = DBClient.getInstance();

  async createCircle(newCircleInput: {creator: string, name: string, picturePath: string, isPublic: boolean}): Promise<Circle|null> {
    //find the logged in user from db
    const creator = await this._db.prisma.user.findUnique({
        where: {
            username: newCircleInput.creator
        }
    })
    console.log(newCircleInput)

    if (creator) {
        //make the circle
        const createdCircle = await this._db.prisma.circle.create({
            data: {
                name: newCircleInput.name,
                picture: newCircleInput.picturePath,
                ownerId: creator.username,
                isPublic: newCircleInput.isPublic
            }
        })
        console.log(createdCircle)
        //make the explicit circle user relationship
        if (createdCircle) {
            await this._db.prisma.userCircle.create({
                data: {
                    username: creator.username,
                    circleId: createdCircle.id,
                    mod: true
                }
            })
        }
        console.log("CREATED CIRCLE", createdCircle.id)
        return createdCircle;
    }
    return null;

  }

  async deleteCircle(id: string, currentUser:string): Promise<void> {
    try {
        const user = await this._db.prisma.user.findUnique({
            where: {
                username: currentUser
            }
        })
        const circle = await this._db.prisma.circle.findUnique({
            where: {
                id: id
            }
        })
    
        if (!user || !circle || circle.ownerId !== user.username) {
            throw new Error("insufficient permissions")
        }
    
        // delete circle
        await this._db.prisma.circle.delete({
            where: {
                id: id,
            },
          })
    } catch (error:any) {
        throw new Error(error)
    }
  }

  async checkMembership(id: string, currentUser:string): Promise<boolean> {
    try {
        const user = await this._db.prisma.user.findUnique({
            where: {
                username : currentUser
            }
        })
        const membership = await this._db.prisma.userCircle.findFirst({
            where: {
                username: String(user!.username),
                circleId: id
            }
        })
        if (!membership) {
            return false;
        }
        return true
    } catch (error:any) {
        throw new Error(error)
    }
  }
  async checkPublic(id: string): Promise<boolean | null> {
    try {
        const isPublic = await this._db.prisma.circle.findUnique({
            where: {
                id: id
            }
        })
        if (isPublic) {
            return isPublic.isPublic
        }
        return null;
    } catch (err:any){
        console.log(err)
        return null;
    }
  }
  async getCircle (id: string): Promise<Circle | null> {
    try {
        const circle = await this._db.prisma.circle.findUnique({
            include: {
                albums: {
                    select: {
                        id: true,
                        circleId: true,
                        name: true,
                        photos: {
                            take: 1
                        },
                        likes: true
                    }
                }
            },
            where: {
                id: id
            }
        })
        return circle;
    } catch (error:any) {
        throw new Error(error)
    }
  }

//   async listCircles (currentUser:string): Promise<{circle: Circle}[]> {
//     try {
//         const user = await this._db.prisma.user.findUnique({
//             where: {
//                 username: currentUser
//             }
//         })
//         const circleArr = await this._db.prisma.userCircle.findMany({
//             select: {
//                 circle: true
//             },
//             where: {
//                 username: user!.username
//             }
//         })
//         console.log(circleArr)
    
//         return circleArr;
//     } catch (error:any) {
//         throw new Error(error)
//     }
//   }

  async getMembers (circleId: string) {
    let members = await this._db.prisma.userCircle.findMany({
        select: {
            user: {
                select: {
                    username: true,
                    profilePicture: true,
                    displayName: true
                }
            },
            mod: true
        },
        where: {
            circleId: circleId
        }
    })
    const owner = await this._db.prisma.circle.findUnique({
        where: {
            id: circleId
        },
        select: {
            ownerId : true
        }
    })
    members = members.map((member) => {
        if (member.user.username === owner?.ownerId) {
            member.user.owner = true;
        }
        return member
    })
    return members;
  }
  async inviteToCircle(username: string, circleName: string): Promise<void> {
    try {
        const inviteExists = await this._db.prisma.circleInvite.findFirst({
            where: {
                invitee_username: username,
                circleId: circleName
            }
        })
        if (!inviteExists){
            await this._db.prisma.circleInvite.create({
                data:{
                    invitee_username: username,
                    circleId: circleName
                }
              })
        }
    } catch (error:any) {
        throw new Error(error)
    }
  }
  async acceptInvite(id: string, username: string): Promise<void> {
      try {
        const circleInvite = await this._db.prisma.circleInvite.findUnique({
            where: {
                invitee_username_circleId: {
                    circleId: id,
                    invitee_username: username
                }
            }
        })
        if (circleInvite) {
            await this._db.prisma.circleInvite.delete({
                where: {
                    invitee_username_circleId: {
                        circleId: id,
                        invitee_username: username
                    }
                }
            })
            await this._db.prisma.userCircle.create({
                data: {
                    username: username,
                    circleId: id
                }
            })
            return
        } else {
            throw new Error("Failed to accept circle invite")
        }
      } catch (error:any) {
        throw new Error(error)
      }
  }
  async removeRequest(id: string, invitee: string): Promise<void> {
        try {
            const circleInviteReceive = await this._db.prisma.circleInvite.delete({
                where: {
                invitee_username_circleId: {
                    invitee_username: invitee,
                    circleId: id
                }
                }
            })
        } catch (err) {
            return; 
        }
    }
    
    async updateCircle(currentUser: string, circleObj: any): Promise<Circle> {
        const circle = await this._db.prisma.circle.findUnique({
            where: {
                id: circleObj.circleId,
                OR: [{
                    ownerId: currentUser
                },
                {
                    UserCircle: {
                        some : {
                            username: currentUser,
                            circleId: circleObj.circleId,
                            mod: true
                        }
                    }
                }
            ]
            }
        })
        if (!circle) {
            throw new Error("insufficient permissions")
        }
        const updatedCircle = this._db.prisma.circle.update({
            where: {
                id: circleObj.circleId
            }, 
            data: {
                picture: circleObj.circleImg,
                name: circleObj.circleName,
                isPublic: circleObj.isPublic
            }
        })
        return updatedCircle;
    }
    async mod(modHelperObj: {loggedInUser: string, member: string, circleId: string}): Promise<void> {
        try {
            const circle = await this._db.prisma.circle.findUnique({
                where: {
                    id: modHelperObj.circleId
                }
            })
            if (!circle) {
                throw new Error("circle not found")
            }
            if (circle.ownerId !== modHelperObj.loggedInUser){
                throw new Error("insufficient permissions")
            }
            const relation = await this._db.prisma.userCircle.findUnique({
                where: {
                    username_circleId: {
                        username: modHelperObj.member,
                        circleId: circle.id
                    }
                }
            })
            if (!relation) {
                throw new Error("user is not a member of the circle")
            }
            await this._db.prisma.userCircle.update({
                where: {
                    username_circleId: {
                        username: modHelperObj.member,
                        circleId: circle.id
                    }
                },
                data: {
                    mod: !(relation.mod)
                }
            })
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async removeUser(userHelper: { loggedInUser: string; member: string; circleId: string; }): Promise<void> {
        try {
            const circle = await this._db.prisma.circle.findUnique({
                where: {
                    id: userHelper.circleId
                }
            })
    
            if (!circle) {
                throw new Error("missing circle")
            }
            if (userHelper.member === circle.ownerId) {
                throw new Error("Cannot remove the owner");
            }
            if (userHelper.loggedInUser === circle.ownerId) {
                    await this._db.prisma.userCircle.delete({
                        where: {
                            username_circleId: {
                                username: userHelper.member,
                                circleId: circle.id
                            }
                        }
                    })     
            } else {
                const members = await this.getMembers(userHelper.circleId)
                const found = members.find((member) => member.user.username === userHelper.loggedInUser)
                if (!found) {
                    throw new Error("you are not a member of the circle")
                }
                if (found.mod === false) {
                    throw new Error("insufficient permissions")
                } else {
                    const removeUser = members.find((member) => member.user.username === userHelper.member)
                    if (removeUser && (removeUser.mod !== true)){
                        await this._db.prisma.userCircle.delete({
                            where: {
                                username_circleId: {
                                    username: userHelper.member,
                                    circleId: circle.id
                                }
                            }
                        })    
                    } 
                }
            }
            
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async createShareLink(shareHelper: { loggedInUser: string; circleId: string; }): Promise<string> {
        try {
            const circle = await this._db.prisma.circle.findUnique({
                where: {
                    id: shareHelper.circleId
                }, 
                select: {
                    ownerId: true,
                    UserCircle: true
                }
            })
            if (!circle) {
                throw new Error ("could not find circle")
            }
            let isMod = false;
            const member = circle.UserCircle.find((user) => {
                user.username === shareHelper.loggedInUser
            })
            if (member) {
                isMod = member.mod
            }
            if (shareHelper.loggedInUser === circle.ownerId || isMod) {
                const expiry = new Date(new Date().setDate(new Date().getDate() + 7))
                const token = await this._db.prisma.token.create({
                    data: {
                        expiresAt: expiry,
                        creatorId: shareHelper.loggedInUser,
                        circleId: shareHelper.circleId,
                        accessToken: randomUUID()
                    }
                })
                return `/circle/${shareHelper.circleId}/view/${token.accessToken}`
            } else {
                throw new Error("insufficient permissions to create share link")
            }
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async getCircleWithToken (circleId: string, token: string): Promise<Circle | null> {
        try {

            const tokenObj = await this._db.prisma.token.findFirst({ 
                where: {
                    circleId: circleId,
                    accessToken: token
                }
            })
            const requestTime = new Date()
            if (!tokenObj || (tokenObj.expiresAt.valueOf() - requestTime.valueOf()) <= 0) {
                throw new Error("invalid request")
            }
            const circle = await this._db.prisma.circle.findUnique({
                include: {
                    albums: {
                        select: {
                            id: true,
                            circleId: true, 
                            name: true,
                            photos: {
                                take: 1
                            },
                            likes: true
                        }
                    }
                },
                where: {
                    id: circleId
                }
            })
            return circle;
        } catch (error:any) {
            throw new Error(error)
        }
      }
}
