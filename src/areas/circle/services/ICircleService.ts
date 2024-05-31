import ICircle from "../../../interfaces/circle.interface";
import { User, Circle } from '@prisma/client'

// ⭐️ Feel free to change this interface in any way you like. It is simply an example...
export default interface ICircleService {
    createCircle(newCircleInput: any):any
    deleteCircle(id: string, currentUser: string): Promise<void>
    checkMembership(id: string, currentUser: string): Promise<boolean>
    checkPublic(id:string): Promise<boolean | null>
    getCircle(id: string): Promise<Circle | null>
    // listCircles(currentUser: string): Promise<{circle: Circle}[]>
    inviteToCircle(username: string, circleName: string): Promise<void | string>
    getMembers(id: string): Promise<{user: {username: string, profilePicture: string}}[] | null>
    acceptInvite(id: string, username: string): Promise<void | any>
    removeRequest(id: string, invitee: string): Promise<void>
    updateCircle(currentUser: string, circleObj: any): Promise<any>
    mod(modHelper: {loggedInUser: string, member: string, circleId: string}): Promise<void>
    removeUser(userHelper: {loggedInUser: string, member: string, circleId: string}): Promise<void>
    createShareLink(shareHelper: {loggedInUser: string, circleId: string}): Promise<string>
    getCircleWithToken(circleId: string, token: string): Promise<any | null>
}
