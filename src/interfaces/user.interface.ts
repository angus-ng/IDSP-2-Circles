//NOTE - You probably won't need this in the long run, but it'll probably be
// helpful while creating your MockAuthenticationService implementations
export default interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}
