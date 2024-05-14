// import type { User } from "@prisma/client";
import { User } from "@prisma/client";
export type UserDTO = User;

export interface IAuthenticationService {
  findUserByEmail(email: String): Promise<User | null>;
  createUser(user: UserDTO): Promise<User | null>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | null>;
}
