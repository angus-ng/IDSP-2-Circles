import { CircleInvite, FriendRequest } from "@prisma/client"

interface Activies {
    friendRequests: FriendRequest[]
    circleInvites: CircleInvite[]
}
export default Activies