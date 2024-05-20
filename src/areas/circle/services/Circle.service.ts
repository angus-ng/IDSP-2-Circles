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
                    circleId: createdCircle.id
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
            return;
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
  async checkPublic(id: string): Promise<boolean> {
    try {
        const isPublic = await this._db.prisma.circle.findUnique({
            where: {
                id: id
            }
        })
        return isPublic!.isPublic
    } catch (err:any){
        throw new Error(err)
    }
  }
  async getCircle (id: string): Promise<Circle | null> {
    try {
        const circle = await this._db.prisma.circle.findUnique({
            include: {
                albums: {
                    select: {
                        id: true,
                        name: true,
                        photos: {
                            take: 1
                        }
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
    const members = await this._db.prisma.userCircle.findMany({
        select: {
            user: {
                select: {
                    username: true,
                    profilePicture: true
                }
            }
        },
        where: {
            circleId: circleId
        }
    })
    return members;
  }
  async inviteToCircle(username: string, circleName: string): Promise<void> {
    try {
        await this._db.prisma.circleInvite.create({
          data:{
              invitee_username: username,
              circleId: circleName
          }
        })
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
                ownerId: currentUser
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
}
