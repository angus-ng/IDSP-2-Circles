import { Activity, CircleInvite, FriendRequest } from "@prisma/client"

interface Activities {
    friendRequests: FriendRequest[]
    circleInvites: CircleInvite[]
    newCommentActivities: any[]
    replyToCommentActivities: any[]
    likeAlbumActivities: any[],
    newPhotoActivities: any[]
    likeCommentActivities: any[]
    newAlbumActivities: any[]
}
export default Activities