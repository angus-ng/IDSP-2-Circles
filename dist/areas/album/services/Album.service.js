"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumService = void 0;
const PrismaClient_1 = __importDefault(require("../../../PrismaClient"));
class AlbumService {
    constructor() {
        this._db = PrismaClient_1.default.getInstance();
    }
    createAlbum(newAlbumInput) {
        return __awaiter(this, void 0, void 0, function* () {
            //find the logged in user from db
            const creator = yield this._db.prisma.user.findUnique({
                where: {
                    username: newAlbumInput.creator
                }
            });
            if (creator) {
                //make the album
                const createdAlbum = yield this._db.prisma.album.create({
                    data: {
                        name: newAlbumInput.albumName,
                        circleId: newAlbumInput.circleId,
                    }
                });
                //make the explicit album user relationship
                if (createdAlbum) {
                    for (let i = 0; i < newAlbumInput.photos.length; i++) {
                        const file = yield this._db.prisma.photo.create({
                            data: {
                                src: newAlbumInput.photos[i].photoSrc,
                                userId: creator.username,
                                albumId: createdAlbum.id
                            }
                        });
                    }
                    return createdAlbum;
                }
            }
            return null;
        });
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
    checkMembership(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: currentUser
                }
            });
            const albumCircleId = yield this._db.prisma.album.findUnique({
                select: {
                    circleId: true
                },
                where: {
                    id: id
                }
            });
            if (!albumCircleId || !user) {
                return false;
            }
            const membership = yield this._db.prisma.userCircle.findFirst({
                where: {
                    userId: user.id,
                    circleId: albumCircleId.circleId
                }
            });
            if (!membership) {
                return false;
            }
            return true;
        });
    }
    getAlbum(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield this._db.prisma.album.findUnique({
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
            });
            return album;
        });
    }
    listAlbums(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: currentUser
                }
            });
            //return new Error("Not implemented");
        });
    }
}
exports.AlbumService = AlbumService;
