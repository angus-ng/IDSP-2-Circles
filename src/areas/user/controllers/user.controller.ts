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
    this.router.post(`${this.path}/sendFriendRequest`, ensureAuthenticated, this.friend);
    this.router.post(`${this.path}/unfriend`, ensureAuthenticated, this.unfriend);
    this.router.get(`${this.path}/getFriends/:username`, ensureAuthenticated, this.getFriends)
    this.router.get(`${this.path}/getActivities/:username`, ensureAuthenticated, this.getActivities)
    this.router.post(`${this.path}/accept`, ensureAuthenticated, this.acceptFriendRequest)
    this.router.post(`${this.path}/removeRequest`, ensureAuthenticated, this.removeFriendRequest)
    this.router.get(`${this.path}/search/:input`, ensureAuthenticated, this.search)
    this.router.get(`${this.path}/searchAll`, ensureAuthenticated, this.searchAll)
  }
  private friend = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const { requester, requestee } = req.body
      if (loggedInUser === requester) {
        const message = await this._service.friend(requester, requestee)
        res.status(200).json({success:true, data: message})
      } else {
        res.status(400).json({success:false, error: "Failed to send friend request"})
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  private unfriend = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const { requester, requestee } = req.body
      if (loggedInUser === requester) {
        const message = await this._service.unfriend(requester, requestee)
        res.status(200).json({success:true, data: message})
      } else {
        res.status(400).json({success:false, error: "Failed to unfriend"})
      }
    } catch (error:any) {
      throw new Error(error)
    }
  }
  private getFriends = async (req: Request, res: Response) => {
    let loggedInUser = req.user!.username
    const username = req.params.username
    if (loggedInUser === username) {
      const friends = await this._service.getFriends(username)
      res.status(200).json({success: true, data: friends})
    } else {
      res.status(400).json({success:false, error: "Not authorized"})
    }
  }

  private getActivities = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const username = req.params.username
      if (loggedInUser === username) {
        const activities = await this._service.getActivities(username)
        res.status(200).json({success:true, data: activities})
      } else {
        res.status(400).json({success:false, error: "Not authorized"})
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private acceptFriendRequest = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const { requester, requestee } = req.body
      if (loggedInUser === requestee) {
        await this._service.acceptRequest(requester, requestee)
        res.status(200).json({success:true, data: null})
      } else {
        res.status(400).json({success:false, error: "Failed to accept friend request"})
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private removeFriendRequest = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const { user1, user2 } = req.body
      if (loggedInUser === user2) {
        await this._service.removeRequest(user1, user2)
        res.status(200).json({success:true, data: null})
      } else {
        res.status(400).json({success:false, error: "Failed to accept friend request"})
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  
  private search = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const input = req.params.input
      const output = await this._service.search(input, loggedInUser)
      res.status(200).json({success:true, data: output})
    } catch (error: any) {
      throw new Error(error)
    }
  }
  private searchAll = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const output = await this._service.search("", loggedInUser)
      res.status(200).json({success:true, data: output})
    } catch (error: any) {
      throw new Error(error)
    }
  }
}

export default UserController;