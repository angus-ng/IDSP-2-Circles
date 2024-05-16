import { Album } from '@prisma/client'

export default interface IAlbumService {
    createAlbum(newAlbumInput: any):any
    //deleteAlbum(id: string, currentUser: string): Promise<void>
    checkMembership(id: string, currentUser: string): Promise<boolean>
    getAlbum(id: string): Promise<Album | null>
    listAlbums(currentUser: string): Promise<{album: Album}[] | void>
    getComments(albumId: string): Promise<any>
    createComment(currentUser: string, message: string, albumId: string, commentId?:string): Promise<void>
    deleteComment(currentUser: string, commentId: string): Promise<void>
    likeComment(currentUser: string, commentId: string): Promise<void>
}
