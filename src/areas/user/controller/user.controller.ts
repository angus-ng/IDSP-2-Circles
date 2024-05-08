import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import IUserService from "../services/IUserService";
import { Circle } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleSingleUpload";
import multer from 'multer';

class UserController implements IController {
  public path = "/user";
  public router = Router();
  private _service: IUserService;

  constructor(circleService: IUserService) {
    this.initializeRoutes();
    this._service = circleService;
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/follow`, ensureAuthenticated, this.follow);
    this.router.post(`${this.path}/unfollow`, ensureAuthenticated, this.unfollow);
    this.router.get(`${this.path}/getFollowers`, ensureAuthenticated, this.getFollowers)
    this.router.get(`${this.path}/getFollowing`, ensureAuthenticated, this.getFollowing)
  }
  async follow(req: Request, res: Response) {
  }
  async unfollow(req: Request, res: Response) {
  }
  async getFollowers(req: Request, res: Response) {
    await this._service.getFollowers("A_A")
  }
  async getFollowing(req: Request, res: Response) {
    await this._service.getFollowing("A_A")
  }

}

export default UserController;
