import { User } from "@prisma/client"
import Activies from "./../../../interfaces/activities.interface"

// ⭐️ Feel free to change this interface in any way you like. It is simply an example...
export default interface IUserService {
    friend(requester: string, requestee: string): Promise<void|{requestee:string, requester:string, status:string}>
    unfriend(requester: string, requestee: string): Promise<string | void>
    getFriends(followingName: string): Promise<User[] | void>
    getActivities(username: string): Promise<Activies | void>
    acceptRequest(requester: string, requestee: string): Promise<void |{requester:string, requestee:string,status:string}>
    removeRequest(user1: string, user2: string): Promise<void>
    search(input: string, currentUser: string): Promise<User[]>
    getUser(username: string, currentUser: string): Promise<any>
    ifEmailTaken(email: string): Promise<boolean>
    getProfilePicture(username: string): Promise<string>
    getFeed(username: string): Promise<string>
    getInfoForMap(username: string): Promise<any>
}
