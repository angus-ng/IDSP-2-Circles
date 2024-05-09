import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import IUserService from "../services/IUserService";
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { UserService } from "../services";

class UserController implements IController {
  public path = "/user";
  public router = Router();
  private _service: IUserService;

  constructor(userService: IUserService) {
    this.initializeRoutes();
    this._service = userService;
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/follow`, ensureAuthenticated, this.follow);
    this.router.post(`${this.path}/unfollow`, ensureAuthenticated, this.unfollow);
    this.router.get(`${this.path}/getFollowers/:followingName`, ensureAuthenticated, this.getFollowers)
    this.router.get(`${this.path}/getFollowing/:followerName`, ensureAuthenticated, this.getFollowing)
  }
  async follow(req: Request, res: Response) {
  }
  async unfollow(req: Request, res: Response) {
  }
  async getFollowers(req: Request, res: Response) {
    const followerName = req.params.followerName
    console.log(req.params.followerName,"getFollowers")
    await this._service.getFollowers(followerName)
  }
  async getFollowing(req: Request, res: Response) {
    const followingName = req.params.followingName

    console.log(req.query, req.params,"getFollowing")
    const userservice = new UserService()
    //console.log(this._service,"hello")
    await userservice getFollowing(followingName)
    //await this._service.getFollowing("A_A")
  }

}

export default UserController;
