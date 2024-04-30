import DBClient from "../../../PrismaClient";
import ICircle from "../../../interfaces/circle.interface";
import ICircleService from "./ICircleService";
import { Circle } from '@prisma/client'

export class CircleService implements ICircleService {
  readonly _db: DBClient = DBClient.getInstance();

  async createCircle(newCircleInput: any) {
    //find the logged in user from db
    const creator = await this._db.prisma.user.findUnique({
        where: {
            username: newCircleInput.creator
        }
    })

    if (creator){
        //make the circle
        const createdCircle = await this._db.prisma.circle.create({
            data: {
                name: newCircleInput.name,
                picture: newCircleInput.picturePath,
                ownerId: creator.username
            }
        })


        //make the explicit circle user relationship
        if (createdCircle) {
            await this._db.prisma.userCircle.create({
                data: {
                    userId: creator.id,
                    circleId: createdCircle.id
                }
            })
        }
    }

  }

  async deleteCircle(id: string, currentUser:string): Promise<void> {
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
  }

  

}
