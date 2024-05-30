import { Album } from '@prisma/client'
export interface AlbumFromGetAlbum {
    id: string;
    circle: {
        id: string;
        UserCircle: {
            user: {
                username: string;
                profilePicture: string;
            };
        }[];
        name: string;
    };
    photos: {
        id: string;
        src: string;
    }[];
    name: string;
    likeCount: number;
    likes: {
        user:any
    }[];
} 

export default interface IAlbumService {
    createAlbum(newAlbumInput: any):Promise<{user: string, members:string[], circleName:string, id:string}|undefined>
    //deleteAlbum(id: string, currentUser: string): Promise<void>
    updateAlbum(currentUser: string, albumId: string, newPhoto: any[]): Promise<{album:AlbumFromGetAlbum, newPhotos:any[]} | null>
    checkMembership(id: string, currentUser: string, circleId?: boolean): Promise<boolean>
    checkPublic(id: string): Promise<boolean>
    getAlbum(id: string): Promise<AlbumFromGetAlbum | null>
    // listAlbums(currentUser: string): Promise<{album: Album}[] | void>
    likeAlbum(currentUser: string, albumId: string): Promise<{members:string[], user:string, albumName:string} | undefined>
    getComments(albumId: string): Promise<any>
    createComment(currentUser: string, message: string, albumId: string, commentId?:string): Promise<any>
    deleteComment(currentUser: string, commentId: string): Promise<void>
    likeComment(currentUser: string, commentId: string): Promise<void| {owner:string | null, albumName:string | undefined, user:string}>
}
