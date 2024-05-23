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
            console.log("I RAN");
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
                        ownerName: newAlbumInput.creator
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
    checkMembership(id_1, currentUser_1) {
        return __awaiter(this, arguments, void 0, function* (id, currentUser, circleId = false) {
            const user = yield this._db.prisma.user.findUnique({
                where: {
                    username: currentUser
                }
            });
            console.log(circleId);
            let albumCircleId;
            if (!circleId) {
                const foundId = yield this._db.prisma.album.findUnique({
                    select: {
                        circleId: true
                    },
                    where: {
                        id: id
                    }
                });
                if (foundId) {
                    albumCircleId = foundId.circleId;
                }
            }
            else {
                const foundId = yield this._db.prisma.circle.findUnique({
                    select: {
                        id: true
                    },
                    where: {
                        id: id
                    }
                });
                if (foundId) {
                    albumCircleId = foundId.id;
                }
            }
            if (!albumCircleId || !user) {
                return false;
            }
            const membership = yield this._db.prisma.userCircle.findFirst({
                where: {
                    username: user.username,
                    circleId: albumCircleId
                }
            });
            if (!membership) {
                return false;
            }
            return true;
        });
    }
    likeAlbum(currentUser, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLike = yield this._db.prisma.like.findFirst({
                    where: {
                        userId: currentUser,
                        albumId: albumId
                    }
                });
                if (existingLike) {
                    yield this._db.prisma.like.delete({
                        where: {
                            id: existingLike.id
                        }
                    });
                    yield this._db.prisma.album.update({
                        where: {
                            id: albumId
                        },
                        data: {
                            likeCount: {
                                decrement: 1
                            }
                        }
                    });
                    console.log("Album unliked successfully");
                }
                else {
                    yield this._db.prisma.like.create({
                        data: {
                            userId: currentUser,
                            albumId: albumId
                        }
                    });
                    yield this._db.prisma.album.update({
                        where: {
                            id: albumId
                        },
                        data: {
                            likeCount: {
                                increment: 1
                            }
                        }
                    });
                    console.log("Album liked successfully");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    checkPublic(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPublic = yield this._db.prisma.album.findUnique({
                where: {
                    id: id
                },
                select: {
                    circle: {
                        select: {
                            isPublic: true
                        }
                    }
                }
            });
            if (!isPublic) {
                return false;
            }
            return isPublic.circle.isPublic;
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
                    likes: {
                        select: {
                            user: {
                                select: {
                                    username: true,
                                    profilePicture: true,
                                }
                            }
                        }
                    },
                    likeCount: true,
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
    updateAlbum(currentUser, id, newPhotos) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasPermission = yield this.checkMembership(id, currentUser);
            if (!hasPermission) {
                throw new Error("User does not have permission to update this album.");
            }
            const existingAlbum = yield this._db.prisma.album.findUnique({
                where: { id },
                include: { photos: true }
            });
            if (!existingAlbum) {
                throw new Error("Album not found.");
            }
            if (newPhotos) {
                for (let i = 0; i < newPhotos.length; i++) {
                    const file = yield this._db.prisma.photo.create({
                        data: {
                            src: newPhotos[i].photoSrc,
                            userId: currentUser,
                            albumId: id
                        }
                    });
                }
                return newPhotos;
            }
            return this.getAlbum(id);
        });
    }
    //   async listAlbums (currentUser:string): Promise<{album: Album}[] | void> { // remove this void when implemented
    //     const user = await this._db.prisma.user.findUnique({
    //         where: {
    //             username: currentUser
    //         }
    //     })
    //     //return new Error("Not implemented");
    //   }
    getComments(albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            let album = yield this._db.prisma.album.findUnique({
                where: {
                    id: albumId
                }
            });
            if (!album) {
                return;
            }
            let comment = yield this._db.prisma.$queryRaw `WITH RECURSIVE NestedComments AS (
        -- Anchor member: Select top-level comments (those with NULL parentId)
        SELECT 
          c.id, 
          c.createdAt, 
          c.message, 
          c.userId, 
          c.likeCount, 
          c.albumId, 
          c.parentId,
          1 AS level,
          u.username,
          u.profilePicture,
          u.displayName
        FROM 
          Comment c
        LEFT JOIN
            User u on c.userId = u.username
        WHERE 
          parentId IS NULL AND albumId = ${album.id}
        UNION ALL
      
        -- Recursive member: Select child comments
        SELECT 
          c.id, 
          c.createdAt, 
          c.message, 
          c.userId, 
          c.likeCount, 
          c.albumId, 
          c.parentId,
          nc.level + 1 AS level,
          u.username,
          u.profilePicture,
          u.displayName
        FROM 
          Comment c
        INNER JOIN 
          NestedComments nc ON c.parentId = nc.id
        LEFT JOIN
        User u ON c.userId = u.username
      )
      -- Final SELECT: Retrieve all comments from NestedComments CTE
      SELECT 
    NestedComments.id, 
    NestedComments.createdAt, 
    NestedComments.message, 
    NestedComments.userId, 
    NestedComments.likeCount, 
    NestedComments.albumId, 
    NestedComments.parentId,
    NestedComments.username,
    NestedComments.displayName,
    NestedComments.profilePicture,
    NestedComments.level,
    GROUP_CONCAT(l.userId, ",") AS likedBy
    FROM 
        (
            SELECT 
                c.id, 
                c.createdAt, 
                c.message, 
                c.userId, 
                c.likeCount, 
                c.albumId, 
                c.parentId,
                1 AS level,
                u.username,
                u.profilePicture,
                u.displayName
            FROM 
                Comment c
            LEFT JOIN
                User u on c.userId = u.username
            WHERE 
                parentId IS NULL AND albumId = ${album.id}
            UNION ALL
            SELECT 
                c.id, 
                c.createdAt, 
                c.message, 
                c.userId, 
                c.likeCount, 
                c.albumId, 
                c.parentId,
                nc.level + 1 AS level,
                u.username,
                u.profilePicture,
                u.displayName
            FROM 
                Comment c
            INNER JOIN 
                NestedComments nc ON c.parentId = nc.id
            LEFT JOIN
                User u ON c.userId = u.username
    ) AS NestedComments
        LEFT JOIN
            Like l ON NestedComments.id = l.commentId
        GROUP BY
        NestedComments.id, 
        NestedComments.createdAt, 
        NestedComments.message, 
        NestedComments.userId, 
        NestedComments.likeCount, 
        NestedComments.albumId, 
        NestedComments.parentId,
        NestedComments.username,
        NestedComments.displayName,
        NestedComments.profilePicture,
        NestedComments.level
        ORDER BY 
            NestedComments.createdAt;`;
            comment = comment.map((comment) => {
                comment.user = {
                    profilePicture: comment.profilePicture,
                    username: comment.username,
                    displayName: comment.displayName
                };
                comment.likedBy ? comment.likedBy = comment.likedBy.split(",") : comment.likedBy;
                delete comment.profilePicture;
                delete comment.username;
                delete comment.displayName;
                return comment;
            });
            const commentMap = new Map;
            let topLevelComments = [];
            comment.forEach((comment) => {
                if (comment.level == 1) {
                    topLevelComments.push(comment);
                }
                commentMap.set(comment.id, comment);
                if (comment.level > 1) {
                    const parentComment = commentMap.get(comment.parentId);
                    if (parentComment) {
                        if (!parentComment.replies) {
                            parentComment.replies = [];
                        }
                        parentComment.replies.push(comment);
                    }
                }
                delete comment.level;
            });
            return topLevelComments;
        });
    }
    createComment(currentUser, message, albumId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newComment = yield this._db.prisma.comment.create({
                    data: {
                        message: message,
                        userId: currentUser,
                        albumId: albumId
                    }
                });
                if (commentId && newComment) {
                    yield this._db.prisma.comment.update({
                        where: {
                            id: commentId
                        },
                        data: {
                            replies: { connect: newComment }
                        }
                    });
                    console.log(commentId);
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteComment(currentUser, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this._db.prisma.comment.findUnique({
                    where: {
                        id: commentId,
                        userId: currentUser
                    },
                    select: {
                        replies: true
                    }
                });
                if (!comment) {
                    return;
                }
                if (comment.replies.length) {
                    yield this._db.prisma.comment.update({
                        where: {
                            id: commentId,
                            userId: currentUser
                        },
                        data: {
                            userId: null,
                            message: null
                        }
                    });
                }
                else {
                    yield this._db.prisma.comment.delete({
                        where: {
                            id: commentId,
                            userId: currentUser
                        }
                    });
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    likeComment(currentUser, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLike = yield this._db.prisma.like.findFirst({
                    where: {
                        userId: currentUser,
                        commentId: commentId
                    }
                });
                if (existingLike) {
                    yield this._db.prisma.like.delete({
                        where: {
                            id: existingLike.id
                        }
                    });
                    const updatedComment = yield this._db.prisma.comment.update({
                        where: {
                            id: commentId
                        },
                        data: {
                            likeCount: {
                                decrement: 1
                            }
                        }
                    });
                    console.log("Comment unliked successfully", updatedComment);
                }
                else {
                    yield this._db.prisma.like.create({
                        data: {
                            userId: currentUser,
                            commentId: commentId
                        }
                    });
                    const updatedComment = yield this._db.prisma.comment.update({
                        where: {
                            id: commentId
                        },
                        data: {
                            likeCount: {
                                increment: 1
                            }
                        }
                    });
                    console.log("Comment liked successfully", updatedComment);
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.AlbumService = AlbumService;
