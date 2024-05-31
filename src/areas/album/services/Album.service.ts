import DBClient from "../../../PrismaClient";
import IAlbumService, { AlbumFromGetAlbum } from "./IAlbumService";
import { Album, Comment } from '@prisma/client'

const getMembers = async (circleId: string, db: any) => {
    const members = await db.prisma.userCircle.findMany({
        select: {
            user: {
                select: {
                    username: true,
                }
            }
        },
        where: {
            circleId: circleId
        }
    })
    //@ts-ignore
    return members.map(obj => obj.user.username);
}

export class AlbumService implements IAlbumService {
    readonly _db: DBClient = DBClient.getInstance();

    async createAlbum(newAlbumInput: any): Promise<{ user: string, members: string[], circleName: string, id: string } | undefined> {
        //find the logged in user from db
        const creator = await this._db.prisma.user.findUnique({
            where: {
                username: newAlbumInput.creator
            }
        })

        if (creator) {
            //make the album
            const createdAlbum = await this._db.prisma.album.create({
                data: {
                    name: newAlbumInput.albumName,
                    circleId: newAlbumInput.circleId,
                    ownerName: newAlbumInput.creator
                }, include: {
                    circle: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            //make the explicit album user relationship
            if (createdAlbum) {
                let albumGps: any = null
                let gpsCount = 0
                for (let photo of newAlbumInput.photos) {
                    if (photo.photoSrc.gps && gpsCount === 0) {
                        gpsCount = 1
                        albumGps = photo.gps
                    }
                }
                for (let i = 0; i < newAlbumInput.photos.length; i++) {
                    const file = await this._db.prisma.photo.create({
                        data: {
                            src: newAlbumInput.photos[i].photoSrc.url,
                            userId: creator.username,
                            albumId: createdAlbum.id
                        }
                    })
                }

                if (newAlbumInput.location) {
                    albumGps = newAlbumInput.location
                }
                if (albumGps) {
                    const albumWithGps = await this._db.prisma.album.update({
                        where: {
                            id: createdAlbum.id
                        },
                        data: {
                            lat: albumGps.lat.toString(),
                            long: albumGps.long.toString()
                        }
                    })
                }
                const members = await getMembers(createdAlbum.circleId, this._db)
                return { user: newAlbumInput.creator, members, circleName: createdAlbum.circle.name, id: createdAlbum.id };
            }
        }
        return;
    }


    async checkMembership(id: string, currentUser: string, circleId = false): Promise<boolean> {
        const user = await this._db.prisma.user.findUnique({
            where: {
                username: currentUser
            }
        })
        let albumCircleId;
        if (!circleId) {
            const foundId = await this._db.prisma.album.findUnique({
                select: {
                    circleId: true
                },
                where: {
                    id: id
                }
            })
            if (foundId) {
                albumCircleId = foundId.circleId
            }
        } else {
            const foundId = await this._db.prisma.circle.findUnique({
                select: {
                    id: true
                },
                where: {
                    id: id
                }
            })
            if (foundId) {
                albumCircleId = foundId!.id
            }
        }

        if (!albumCircleId || !user) {
            return false;
        }
        const membership = await this._db.prisma.userCircle.findFirst({
            where: {
                username: user.username,
                circleId: albumCircleId
            }
        })

        if (!membership) {
            return false;
        }

        return true
    }

    async likeAlbum(currentUser: string, albumId: string): Promise<{ members: string[], user: string, albumName: string } | undefined> {
        try {
            const existingLike = await this._db.prisma.like.findFirst({
                where: {
                    userId: currentUser,
                    albumId: albumId
                }
            });

            if (existingLike) {
                await this._db.prisma.like.delete({
                    where: {
                        id: existingLike.id
                    }
                });

                await this._db.prisma.album.update({
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
            } else {
                await this._db.prisma.like.create({
                    data: {
                        userId: currentUser,
                        albumId: albumId
                    }
                });

                const album = await this._db.prisma.album.update({
                    where: {
                        id: albumId
                    },
                    data: {
                        likeCount: {
                            increment: 1
                        }
                    }
                });
                const members = await getMembers(album.circleId, this._db)
                console.log("Album liked successfully");
                return { members, user: currentUser, albumName: album.name };
            }
        } catch (err) {
            throw err;
        }
    }

    async checkPublic(id: string): Promise<boolean> {
        const isPublic = await this._db.prisma.album.findUnique({
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
        })
        if (!isPublic) {
            return false
        }
        return isPublic.circle.isPublic;
    }

    async getAlbum(id: string): Promise<AlbumFromGetAlbum | null> {
        const album = await this._db.prisma.album.findUnique({
            select: {
                name: true,
                id: true,
                photos: {
                    select: {
                        id: true,
                        src: true,
                        userId: true
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
                                },
                                mod: true
                            }
                        },
                        ownerId: true
                    },
                },
            },
            where: {
                id: id
            }
        })
        return album;
    }

    async addPhotos(currentUser: string, id: string, newPhotos: any[]): Promise<any> {
        const album = await this.getAlbum(id)
        const hasPermission = await this.checkMembership(id, currentUser);
        if (!hasPermission) {
            throw new Error("User does not have permission to update this album.");
        }

        const existingAlbum = await this._db.prisma.album.findUnique({
            where: { id },
            include: { photos: true }
        });

        if (!existingAlbum) {
            throw new Error("Album not found.");
        }

        if (newPhotos) {
            for (let i = 0; i < newPhotos.length; i++) {
                const file = await this._db.prisma.photo.create({
                    data: {
                        src: newPhotos[i].photoSrc.url,
                        userId: currentUser,
                        albumId: id,
                        lat: newPhotos[i].photoSrc.gps ? String(newPhotos[i].photoSrc.gps.lat) : null,
                        long: newPhotos[i].photoSrc.gps ? String(newPhotos[i].photoSrc.gps.long) : null
                    }
                })
            }
            return { newPhotos, album }
        }
        return album;
    }

    async getComments(albumId: string): Promise<any> {
        let album = await this._db.prisma.album.findUnique({
            where: {
                id: albumId
            }
        })
        if (!album) {
            return;
        }
        let comment: any[] = await this._db.prisma.$queryRaw`WITH RECURSIVE NestedComments AS (
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
            NestedComments.createdAt;`

        comment = comment.map((comment) => {
            comment.user = {
                profilePicture: comment.profilePicture,
                username: comment.username,
                displayName: comment.displayName
            }
            comment.likedBy ? comment.likedBy = comment.likedBy.split(",") : comment.likedBy
            delete comment.profilePicture;
            delete comment.username;
            delete comment.displayName;
            return comment
        })
        const commentMap = new Map;
        let topLevelComments: Comment[] = [];
        comment.forEach((comment) => {
            if (comment.level == 1) {
                topLevelComments.push(comment)
            }
            commentMap.set(comment.id, comment)
            if (comment.level > 1) {
                const parentComment = commentMap.get(comment.parentId);
                if (parentComment) {
                    if (!parentComment.replies) {
                        parentComment.replies = [];
                    }
                    parentComment.replies.push(comment)
                }
            }
            delete comment.level
        })

        return topLevelComments;
    }

    async createComment(currentUser: string, message: string, albumId: string, commentId?: string) {
        try {
            let childComment;
            const newComment = await this._db.prisma.comment.create({
                data: {
                    message: message,
                    userId: currentUser,
                    albumId: albumId
                }, include: {
                    album: {
                        select: {
                            name: true,
                            ownerName: true
                        }
                    }
                }
            })
            if (commentId && newComment) {
                childComment = await this._db.prisma.comment.update({
                    where: {
                        id: commentId
                    },
                    data: {
                        replies: { connect: newComment }
                    }, include: {
                        parent: {
                            select: {
                                userId: true
                            }
                        }
                    }
                })
            }
            if (childComment) {
                if (childComment.parent)
                    childComment = childComment.parent
            }
            if (childComment) {
                return { user: currentUser, albumName: newComment.album.name, owner: newComment.album.ownerName, parentUser: childComment.userId }
            } else {
                return { user: currentUser, albumName: newComment.album.name, owner: newComment.album.ownerName, parentUser: null }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(currentUser: string, commentId: string) {
        try {
            const comment = await this._db.prisma.comment.findUnique({
                where: {
                    id: commentId
                },
                select: {
                    userId: true,
                    replies: true,
                    album: {
                        select: {
                            circle: {
                                select: {
                                    id: true,
                                    ownerId: true
                                }
                            }
                        }
                    }
                }
            })

            if (!comment) {
                return
            }

            const modStatus = await this._db.prisma.userCircle.findUnique({
                where: {
                    username_circleId: {
                        username: currentUser,
                        circleId: comment.album.circle.id
                    }
                },
                select: {
                    mod: true
                }
            })

            if (comment.album.circle.ownerId === currentUser || comment.userId === currentUser || modStatus) {
                if (comment.replies.length) {
                    await this._db.prisma.comment.update({
                        where: {
                            id: commentId
                        },
                        data: {
                            userId: null,
                            message: null
                        }
                    })
                } else {
                    await this._db.prisma.comment.delete({
                        where: {
                            id: commentId
                        }
                    })
                }
            }

        } catch (err) {
            throw err;
        }
    }

    async likeComment(currentUser: string, commentId: string): Promise<void | { owner: string | null, albumName: string, user: string }> {
        try {
            const existingLike = await this._db.prisma.like.findFirst({
                where: {
                    userId: currentUser,
                    commentId: commentId
                }
            });

            if (existingLike) {
                await this._db.prisma.like.delete({
                    where: {
                        id: existingLike.id
                    }
                });

                const updatedComment = await this._db.prisma.comment.update({
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
            } else {
                const like = await this._db.prisma.like.create({
                    data: {
                        userId: currentUser,
                        commentId: commentId
                    }
                });

                const updatedComment = await this._db.prisma.comment.update({
                    where: {
                        id: commentId
                    },
                    data: {
                        likeCount: {
                            increment: 1
                        }
                    }, include: {
                        album: {
                            select: {
                                name: true
                            }
                        }
                    }
                });
                console.log("Comment liked successfully", updatedComment);
                return { albumName: updatedComment.album.name, user: currentUser, owner: updatedComment.userId }
            }
        } catch (err) {
            throw err;
        }
    }
    async deleteAlbum(albumId: string, currentUser: string): Promise<void> {
        try {
            const album = await this._db.prisma.album.findUnique({
                where: {
                    id: albumId
                },
                include: {
                    circle: {
                        include: {
                            UserCircle: true,
                            owner: {
                                select: { username: true }
                            }
                        },
                    },
                }
            })
            if (!album) {
                throw new Error("could not find album")
            }
            let isMod = false;
            const member = album.circle.UserCircle.find((user) => {
                user.username === currentUser
            })
            if (member) {
                isMod = member.mod
            }
            if (currentUser === album.circle.owner.username || isMod || currentUser === album.ownerName) {
                await this._db.prisma.album.delete({
                    where: {
                        id: albumId
                    }
                })
            } else {
                throw new Error("insufficient permissions to delete album")
            }

        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async deletePhoto(photoId: string, currentUser: string): Promise<void> {
        try {
            const photo = await this._db.prisma.photo.findUnique({
                where: {
                    id: photoId
                },
                include: {
                    album: {
                        include: {
                            circle: {
                                include: {
                                    UserCircle: true
                                }
                            }
                        }
                    }
                }
            })
            if (!photo) {
                throw new Error("could not find photo")
            }
            let isMod = false;
            const member = photo.album.circle.UserCircle.find((user) => {
                user.username === currentUser
            })
            if (member) {
                isMod = member.mod
            }
            if (currentUser === photo.album.circle.ownerId || isMod || currentUser === photo.userId) {
                await this._db.prisma.photo.delete({
                    where: {
                        id: photoId
                    }
                })
            } else {
                throw new Error("insufficient permissions to delete photo")
            }
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async updateAlbum(albumId: string, albumName: string, currentUser: string): Promise<void> {
        try {
            const album = await this._db.prisma.album.findUnique({
                where: {
                    id: albumId
                },
                include: {
                    circle: {
                        select: {
                            ownerId: true,
                            UserCircle: true
                        }
                    }
                }
            })
            if (!album) {
                throw new Error("cannot find album")
            }
            let isMod = false;
            const member = album.circle.UserCircle.find((user) => {
                user.username === currentUser
            })
            if (member) {
                isMod = member.mod
            }
            if (currentUser === album.circle.ownerId || isMod || currentUser === album.ownerName) {
                await this._db.prisma.album.update({
                    where: {
                        id: albumId
                    },
                    data: {
                        name: albumName
                    }
                })
            } else {
                throw new Error("insufficient permissions to delete photo")
            }
        } catch (err) {
            console.log(err)
            throw err;
        }

    }
}
