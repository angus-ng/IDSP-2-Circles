import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import ICircleService from "../services/ICircleService";
import { Circle } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleSingleUpload";
import multer from 'multer';
import { getLocalUser } from "../../../helper/getLocalUser";
import exifr from 'exifr'
import path from "path";
import { io } from '../../../app';

const storage = multer.memoryStorage();
const upload = multer({ storage });

class CircleController implements IController {
  public path = "/circle";
  public router = Router();
  private _service: ICircleService;

  constructor(circleService: ICircleService) {
    this.initializeRoutes();
    this._service = circleService;
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, ensureAuthenticated, upload.none(), this.createCircle);
    this.router.post(`${this.path}/upload`, ensureAuthenticated, upload.single("file"), this.uploadImage);
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.getCircle);
    this.router.post(`${this.path}/:id/delete`, ensureAuthenticated, this.deleteCircle);
    this.router.post(`${this.path}/invite`, ensureAuthenticated, this.circleInvite);
    // this.router.post(`${this.path}/list`, ensureAuthenticated, this.getCircleList);
    this.router.post(`${this.path}/accept`, ensureAuthenticated, this.acceptInvite)
    this.router.post(`${this.path}/decline`, ensureAuthenticated, this.removeCircleInvite)
    this.router.post(`${this.path}/update`, ensureAuthenticated, this.updateCircle)
    this.router.post(`${this.path}/mod`, ensureAuthenticated, this.mod)
    this.router.post(`${this.path}/user/remove`, ensureAuthenticated, this.removeUser)
    this.router.post(`${this.path}/shareLink/create`, ensureAuthenticated, this.createShareLink)
    this.router.get(`${this.path}/:id/view/:accessToken`, this.sandbox);
    this.router.post(`${this.path}/:id/view/:accessToken/`, this.getCircleRestricted);
  }

  private uploadImage = async (req: Request, res: Response) => {
    try {
      const b64 = Buffer.from(req.file!.buffer).toString('base64');
      const dataURI = `data:${req.file!.mimetype};base64,${b64}`;
      const cldRes = await handleUpload(dataURI);
      try {
        let { latitude, longitude } = await exifr.gps(b64)
        console.log("HERE", cldRes)
        if (cldRes.format === "heic"){
          cldRes.url = cldRes.url.split(".heic")[0] + ".jpg"
        }
        res.json({ message: 'File uploaded successfully', data: { url: cldRes.url, gps: { lat: latitude, long: longitude }}});
      } catch (error) {
        res.json({ message: 'File uploaded successfully', data: { url: cldRes.url, gps: null}});
      }
    } catch (error) {
      console.log(error)
    }
  }

  private createCircle = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)

      const { circleName, picturePath } = req.body

      let isPublic = false;
      if (req.body.isPublic === "true") {
        isPublic = true;
      }

      const newCircleInput = {
        creator: loggedInUser,
        name: circleName,
        picturePath: picturePath,
        isPublic: isPublic
      }

      const newCircle = await this._service.createCircle(newCircleInput)

      if (!newCircle) {
        return res.status(200).json({ success: true, data: newCircle });
      }

      res.status(200).json({ success: true, data: newCircle.id });
    } catch (err) {
      return res.status(200).json({ success: true, data: null, error: "failed to create circle" })
    }
  }

  private deleteCircle = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)

      const { id } = req.params
      await this._service.deleteCircle(id, loggedInUser) //this method also checks if its the owner of the circle, maybe a check should be done separately
      res.status(200).json({ success: true, data: null})
    } catch (err) {
      console.log(err)
      return res.status(200).json({ success: true, data: null, error: "failed to delete circle"})
    }
  }
  private getCircle = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      //ensure user is a member of the circle
      let loggedInUser = await getLocalUser(req, res)
      console.log(id)
      const publicStatus = await this._service.checkPublic(id)
      if (!publicStatus) {
        const member = await this._service.checkMembership(id, loggedInUser)
        if (!member) {
          return res.status(200).json({ success: true, data: null });
        }
      }

      const circle = await this._service.getCircle(id)
      console.log(circle)
      const members = await this._service.getMembers(id)
      console.log(members)

      return res.status(200).json({ success: true, data: { circle, members } })
    } catch (err) {
      return res.status(200).json({ success: true, data: null, error: "unable to get circle"});

    }
  }

  private circleInvite = async (req: Request, res: Response) => {
    let loggedInUser = await getLocalUser(req, res)
    const { requestee, circleId } = req.body
    const member = await this._service.checkMembership(circleId, loggedInUser)
    if (!member) {
      return res.status(200).json({ success: true, data: null });
    }
    console.log("inviting", requestee, "to", circleId, "...")
    const circle = await this._service.inviteToCircle(requestee, circleId)
    if (circle) {
      io.to(requestee).emit("circleInvite", {user:loggedInUser, circleName: circle})
    }
    //change to verify selected are friends of current user

    return res.status(200).json({ success: true, data: null });
  }

  // private getCircleList = async (req:Request, res:Response) => {
  //   let loggedInUser = await getLocalUser(req, res)
  //   const circles = await this._service.listCircles(loggedInUser)

  //   res.json({success: true, data: circles})
  // }

  private acceptInvite = async (req: Request, res: Response) => {
    const { id, invitee } = req.body
    let loggedInUser = await getLocalUser(req, res)
    try {
      if (loggedInUser === invitee) {
        const circle = await this._service.acceptInvite(id, invitee)
        for (let member of circle.members) {
          io.to(member).emit('acceptCircleInvite', {user: loggedInUser, circleName: circle.circleName})
        }
      }
      return res.status(200).json({ success: true, data: null });
    } catch (error) {
      return res.status(200).json({ success: false, error: "failed to accept invite" });
    }
  }

  private removeCircleInvite = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { id, invitee } = req.body
      if (loggedInUser === invitee) {
        await this._service.removeRequest(id, invitee)
        res.status(200).json({ success: true, data: null })
      } else {
        res.status(400).json({ success: false, error: "Failed to remove circle invite" })
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private updateCircle = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { circleId, circleImg, circleName, isPublic } = req.body
      console.log(req.body)
      if (!circleId || !circleImg || !circleName || typeof isPublic !== "boolean") {
        return res.status(200).json({ success: true, data: null, error: "missing parameters" })
      }
      const circleObj = {
        circleId,
        circleImg,
        circleName,
        isPublic
      }
      const circle = await this._service.updateCircle(loggedInUser, circleObj) //this checks for ownership
      for (let member of circle.members) {
        io.to(member).emit("updateCircle", {user: loggedInUser, circleName: circle.name})
      }
      res.status(200).json({ success: true, data: circle.id })
    } catch (err) {
      console.log(err)
      res.status(200).json({ success: true, data: null, error: "failed to update circle" })
    }

  }
  private mod = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { member, circleId } = req.body
      if (!member || !circleId) {
        return res.status(200).json({ success: true, data: null, error: "missing parameters" })
      }
      const modHelper = { loggedInUser, member, circleId }
      await this._service.mod(modHelper) //this checks ownership, toggles mod status
      return res.status(200).json({ success: true })
    } catch (err) {
      res.status(200).json({ success: true, data: null, error: "failed to mod/unmod" })
    }
  }
  private removeUser = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { member, circleId } = req.body
      if (!member || !circleId) {
        return res.status(200).json({ success: true, data: null, error: "missing parameters" })
      }
      const userHelper = { loggedInUser, member, circleId }
      await this._service.removeUser(userHelper) //this checks ownership, toggles mod status
      return res.status(200).json({ success: true })
    } catch (err) {
      res.status(200).json({ success: true, data: null, error: "failed to remove user" })
    }
  }
  private createShareLink = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { circleId } = req.body
      if (!circleId) {
        return res.status(200).json({ success: true, data: null, error: "missing parameters" })
      }
      const shareHelper = { loggedInUser, circleId }
      const shareLink = await this._service.createShareLink(shareHelper) //this checks ownership/mod
      return res.status(200).json({ success: true, data:shareLink })
    } catch (err) {
      res.status(200).json({ success: true, data: null, error: "failed to create share link" })
    }
  }
  private getCircleRestricted = async (req: Request, res: Response) => {
    try {
      const { id, accessToken } = req.params
      console.log(id, accessToken)
      if (!id || !accessToken) {
        return res.status(200).json({ success: true, data: null, error: "invalid request" })
      }
      const shareLink = await this._service.getCircleWithToken(id, accessToken) //this checks ownership/mod
      return res.status(200).json({ success: true, data:shareLink })
    } catch (err) {
      console.log(err)
      res.status(200).json({ success: true, data: null, error: "failed to get circle data" })
    }
  }
  private sandbox = async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../../../public/index.html"));
    return;
  }
}

export default CircleController;