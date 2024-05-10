import { AlbumInvite, CircleInvite, FriendRequest } from "@prisma/client"

interface Activies {
    friendRequests: FriendRequest[]
    circleInvites: CircleInvite[]
    albumInvites: AlbumInvite[]
}
export default Activies