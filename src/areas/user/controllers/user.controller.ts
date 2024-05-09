import express, { Request, Response, NextFunction } from "express";
import IController from "../../../interfaces/controller.interface";
import IUserService from "../services/IUserService";
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";

class UserController implements IController {
  public path = "/user";
  public router = express.Router();
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
  private follow = async (req: Request, res: Response) => {
  }
  private unfollow = async (req: Request, res: Response) => {
  }
  private getFollowers = async (req: Request, res: Response) => {
    const followingName = req.params.followingName
    console.log(req.params.followerName,"getFollowers")
    const d = await this._service.getFollowers(followingName)
    console.log(d, "BRUH")
  }
  private getFollowing = async (req: Request, res: Response) => {
    const followerName = req.params.followerName
    console.log(followerName , "THIS")

    console.log(req.query, req.params,"getFollowing")
    //console.log(this._service,"hello")
    // console.log(this._service)
    const d = await this._service.getFollowing(followerName)
    //await this._service.getFollowing("A_A")
    res.status(200).json({success: true, data: null})
  }

}

export default UserController;
