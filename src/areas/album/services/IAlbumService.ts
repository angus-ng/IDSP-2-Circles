import { Album } from '@prisma/client'

export default interface IAlbumService {
    createAlbum(newAlbumInput: any):any
    //deleteAlbum(id: string, currentUser: string): Promise<void>
    checkMembership(id: string, currentUser: string): Promise<boolean>
    getAlbum(id: string): Promise<Album | null>
    listAlbums(currentUser: string): Promise<{album: Album}[] | void>
    acceptInvite(id: string, username: string): Promise<void>
}
