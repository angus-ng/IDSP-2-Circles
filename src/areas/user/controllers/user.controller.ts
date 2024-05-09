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
    this.router.post(`${this.path}/follow`, ensureAuthenticated, this.friend);
    this.router.post(`${this.path}/unfollow`, ensureAuthenticated, this.unfriend);
    this.router.get(`${this.path}/getFriends/:username`, ensureAuthenticated, this.getFriends)
  }
  private friend = async (req: Request, res: Response) => {
  }
  private unfriend = async (req: Request, res: Response) => {
  }
  private getFriends = async (req: Request, res: Response) => {
    const username = req.params.username
    const friends = await this._service.getFriends(username)
    res.status(200).json({success: true, data: friends})
  }

}

export default UserController;