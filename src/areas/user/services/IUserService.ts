import { User } from "@prisma/client"
import Activies from "./../../../interfaces/activities.interface"

// ⭐️ Feel free to change this interface in any way you like. It is simply an example...
export default interface IUserService {
    friend(requester: string, requestee: string): Promise<void>
    unfriend(requester: string, requestee: string): Promise<void>
    getFriends(followingName: string): Promise<User[] | void>
    getActivities(username: string):Promise<Activies | void>
    acceptRequest(requester: string, requestee: string) :Promise<void>
    search(input: string, currentUser: string): Promise<User[]>
    getUser(username:string, currentUser: string): Promise<any>
}
