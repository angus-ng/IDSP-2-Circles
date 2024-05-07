import DBClient from "../../../PrismaClient";
import IAlbumService from "./IAlbumService";
import { Album } from '@prisma/client'

export class AlbumService implements IAlbumService {
  readonly _db: DBClient = DBClient.getInstance();

  async createAlbum(newAlbumInput: any) {
    //find the logged in user from db
    const creator = await this._db.prisma.user.findUnique({
        where: {
            username: newAlbumInput.creator
        }
    })
    console.log(newAlbumInput)

    if (creator){
        //make the album
        const createdAlbum = await this._db.prisma.album.create({
            data: {
                name: newAlbumInput.name,
                pictureList: newAlbumInput.picturePath,
                ownerId: creator.username,
            }
        })

        //make the explicit album user relationship
        if (createdAlbum) {
            await this._db.prisma.userCircle.create({
                data: {
                    userId: creator.id,
                    circleId: createdAlbum.id
                }
            })
        }
    }

  }

//   async deleteAlbum(id: string, currentUser:string): Promise<void> {
//     const user = await this._db.prisma.user.findUnique({
//         where: {
//             username: currentUser
//         }
//     })
//     const album = await this._db.prisma.album.findUnique({
//         where: {
//             id: id
//         }
//     })

//     // if (!user || !album || album.ownerId !== user.username) {
//     //     return;
//     // }

//     // delete album
//     await this._db.prisma.album.delete({
//         where: {
//             id: id,
//         },
//       })
//   }

  async checkMembership(id: string, currentUser:string): Promise<boolean> {
    const user = await this._db.prisma.user.findUnique({
        where: {
            username : currentUser
        }
    })

    const membership = await this._db.prisma.userCircle.findFirst({
        where: {
            userId: String(user!.id),
            circleId: id
        }
    })

    if (!membership) {
        return false;
    }
    return true
  }
  async getAlbum (id: string): Promise<Album | null> {
    const circle = await this._db.prisma.circle.findUnique({
        where: {
            id: id
        }
    })
    return circle;
  }

  async listAlbums (currentUser:string): Promise<{album: Album}[] | void> { // remove this void when implemented
    const user = await this._db.prisma.user.findUnique({
        where: {
            username: currentUser
        }
    })
    //return new Error("Not implemented");
  }
}
