import IComment from "./comment.interface";

interface IPost {
  postId: string;
  message: string;
  likes: number;
  createdAt: Date | string;
  userId: string;
}

export default IPost;
