// import type { User } from "@prisma/client";
import { User } from "@prisma/client";
export type UserDTO = Omit<User, "id">;

export interface IAuthenticationService {
  findUserByEmail(email: String): Promise<User | null>;
  createUser(user: UserDTO): Promise<User | null>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
