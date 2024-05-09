import { User } from "@prisma/client"

// ⭐️ Feel free to change this interface in any way you like. It is simply an example...
export default interface IUserService {
    friend(followerName: string, followingName: string): Promise<void>
    unfriend(followerName: string, followingName: string): Promise<void>
    getFriends(followingName: string): Promise<User[] | void>
}
