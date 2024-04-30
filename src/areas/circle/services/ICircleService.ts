import ICircle from "../../../interfaces/circle.interface";
import { Circle } from '@prisma/client'

// ⭐️ Feel free to change this interface in any way you like. It is simply an example...
export default interface ICircleService {
    createCircle(newCircleInput: any):any
    deleteCircle(id: string, currentUser: string): Promise<void>
}
