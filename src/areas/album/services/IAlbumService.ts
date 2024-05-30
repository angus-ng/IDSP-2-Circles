import { Album } from '@prisma/client'

export default interface IAlbumService {
    createAlbum(newAlbumInput: any):any
    //deleteAlbum(id: string, currentUser: string): Promise<void>
    updateAlbum(currentUser: string, albumId: string, newPhoto: any[]): Promise<Album | null>
    checkMembership(id: string, currentUser: string, circleId?: boolean): Promise<boolean>
    checkPublic(id: string): Promise<boolean>
    getAlbum(id: string): Promise<Album | null>
    // listAlbums(currentUser: string): Promise<{album: Album}[] | void>
    likeAlbum(currentUser: string, albumId: string): Promise<void>
    getComments(albumId: string): Promise<any>
    createComment(currentUser: string, message: string, albumId: string, commentId?:string): Promise<void>
    deleteComment(currentUser: string, commentId: string): Promise<void>
    likeComment(currentUser: string, commentId: string): Promise<void>
    deleteAlbum(albumId: string, currentUser: string): Promise<void>
    deletePhoto(photoId: string, currentUser: string): Promise<void>
}
