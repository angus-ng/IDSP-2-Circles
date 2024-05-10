import { name } from "ejs";
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

    if (creator){
        //make the album
        const createdAlbum = await this._db.prisma.album.create({
            data: {
                name: newAlbumInput.albumName,
                circleId: newAlbumInput.circleId,
                ownerName: newAlbumInput.creator
            }
        })
        console.log(createdAlbum, 'LSJADLkajslkdjkasjdlkasjskla')

        //make the explicit album user relationship
        if (createdAlbum) {
            for (let i=0; i < newAlbumInput.photos.length; i++){
                const file = await this._db.prisma.photo.create({
                    data: {
                        src: newAlbumInput.photos[i].photoSrc,
                        userId: creator.username,
                        albumId: createdAlbum.id
                    }
                })
            }
            return createdAlbum;
        }
    }
    return null;
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

    const albumCircleId = await this._db.prisma.album.findUnique({
        select: {
            circleId: true
        },
        where: {
            id: id
        }
    })

    if (!albumCircleId || !user) {
        return false;
    } 

    const membership = await this._db.prisma.userCircle.findFirst({
        where: {
            username: user.username,
            circleId: albumCircleId.circleId
        }
    })

    if (!membership) {
        return false;
    }

    return true
  }

  async getAlbum (id: string): Promise<any> {
    const album = await this._db.prisma.album.findUnique({
        select: {
                name: true,
                id: true,
            photos: {
                select: {
                    id: true,
                    src: true,
                }
            },
            circle: {
                select: {
                    id: true,
                    name: true,
                    UserCircle: {
                        select: {
                            user: {
                                select: {
                                    username: true,
                                    profilePicture: true
                                }
                            }
                        }
                    }
                },
            },
        },
        where: {
            id: id
        }
    })
    return album;
  }

  async listAlbums (currentUser:string): Promise<{album: Album}[] | void> { // remove this void when implemented
    const user = await this._db.prisma.user.findUnique({
        where: {
            username: currentUser
        }
    })
    //return new Error("Not implemented");
  }
  async acceptInvite(id: string, username: string): Promise<void> {
    try {
        const cirlceInvite = await this._db.prisma.albumInvite.findUnique({
            where: {
                invitee_username_albumId: {
                    albumId: id,
                    invitee_username: username
                }
            }
        })
        if (cirlceInvite) {
            await this._db.prisma.albumInvite.delete({
                where: {
                    invitee_username_albumId: {
                        albumId: id,
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
            throw new Error("Failed to accept album invite")
        }
      } catch (error:any) {
        throw new Error(error)
      }
  }
}
