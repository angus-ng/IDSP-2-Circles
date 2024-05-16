import { name } from "ejs";
import DBClient from "../../../PrismaClient";
import IAlbumService from "./IAlbumService";
import { Album, Comment } from '@prisma/client'

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
        comment.likedBy ? comment.likedBy = comment.likedBy.split(","): comment.likedBy
        delete comment.profilePicture;
        delete comment.username;
        delete comment.displayName;
        return comment
    })
    const commentMap = new Map;
    let topLevelComments: Comment[] = [];
    comment.forEach((comment) => {
        if (comment.level == 1){
            topLevelComments.push(comment)
        }
        commentMap.set(comment.id, comment)
        if (comment.level > 1){
            const parentComment = commentMap.get(comment.parentId);
            if (parentComment){
                if (!parentComment.replies){
                    parentComment.replies = [];
                }
                parentComment.replies.push(comment)
            }
        }
        delete comment.level
    })

    return topLevelComments;
  }

  async createComment(currentUser: string, message: string, albumId: string, commentId?:string) {
    try {
        const newComment = await this._db.prisma.comment.create({
            data: {
                message: message,
                userId: currentUser,
                albumId: albumId
            }
        })
        if (commentId && newComment) {
            await this._db.prisma.comment.update({
                where: {
                    id: commentId
                }, 
                data: {
                    replies: {connect: newComment} 
                }
            })
            console.log(commentId)
        }
      } catch (err) {
        throw err;
    }
    }

    async deleteComment(currentUser: string, commentId: string) {
        try {
            const comment = await this._db.prisma.comment.findUnique({
                where: {
                    id: commentId,
                    userId: currentUser
                },
                select: {
                    replies: true
                }
            })

            if (!comment) {
                 return
            }
            
            if (comment.replies.length) {
                await this._db.prisma.comment.update({
                    where: {
                        id: commentId,
                        userId: currentUser
                    },
                    data: {
                        userId: null,
                        message: null
                    }
                })
            } else {
                await this._db.prisma.comment.delete({
                    where: {
                        id: commentId,
                        userId: currentUser
                    }
                })
            }
        } catch (err) {
            throw err;
        }
    }

    async likeComment(currentUser: string, commentId: string): Promise<void> {
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
                await this._db.prisma.like.create({
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
                    }
                });
    
                console.log("Comment liked successfully" , updatedComment);
            }
        } catch (err) {
            throw err;
        }
    }
    
}
