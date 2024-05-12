import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import ICircleService from "../services/ICircleService";
import { Circle } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleSingleUpload";
import multer from 'multer';

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
    this.router.post(`${this.path}/create`, ensureAuthenticated, upload.none(),  this.createCircle); 
    this.router.post(`${this.path}/upload`, ensureAuthenticated, upload.single("file"), this.uploadImage); 
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.getCircle);
    this.router.get(`${this.path}/:id/delete`, ensureAuthenticated, this.deleteCircle);
    this.router.post(`${this.path}/invite`, ensureAuthenticated, this.circleInvite);
    this.router.post(`${this.path}/list`, ensureAuthenticated, this.getCircleList);
    this.router.post(`${this.path}/accept`, ensureAuthenticated, this.acceptInvite)
    this.router.post(`${this.path}/decline`, ensureAuthenticated, this.removeCircleInvite)
  }

  private uploadImage = async (req: Request, res: Response) => {
    const b64 = Buffer.from(req.file!.buffer).toString('base64');
    const dataURI = `data:${req.file!.mimetype};base64,${b64}`;
    const cldRes = await handleUpload(dataURI);
    
    res.json({ message: 'File uploaded successfully', data:cldRes.url });
  }

  private createCircle = async (req:Request, res:Response) => {
    try {
        let loggedInUser = req.user!.username
        
        const { circleName, picturePath } = req.body
        const newCircleInput = {
          creator: loggedInUser, 
          name: circleName,
            picturePath: picturePath
          }
          //validate the input before passing it to our db
          
        const newCircle = await this._service.createCircle(newCircleInput)

        if (!newCircle){
          return res.status(200).json({ success: true, data:newCircle});
        }

        res.status(200).json({ success: true, data: newCircle.id });
    } catch (err) {
        res.status(200).json({success: true, data: null, error:err})
    }
  }

  private deleteCircle = async (req:Request, res:Response) => {
    try {
      let loggedInUser = req.user!.username

        const { id } = req.params
        await this._service.deleteCircle(id, loggedInUser) //this method also checks if its the owner of the circle, maybe a check should be done separately
        res.redirect("/");
    } catch (err) {
        throw err;
    }
  }
  private getCircle = async (req:Request, res:Response) => {
    try {
      const { id } = req.params

      //ensure user is a member of the circle
      let loggedInUser = req.user!.username
      const member = await this._service.checkMembership(id, loggedInUser)
      if (!member) {
        return res.status(200).json({success: true, data: null});
      }
      
      const circle = await this._service.getCircle(id)
      console.log(circle)
      const members = await this._service.getMembers(id)
      console.log(members)

      return res.status(200).json({success: true, data: { circle, members }})
    } catch (err) {
      throw err;
    }
  }
  
  private circleInvite = async (req:Request, res:Response) => {
    const { requestee, circleId } = req.body

    console.log("inviting",requestee, "to", circleId,"...")
    this._service.inviteToCircle(requestee, circleId)
    
    //change to verify selected are friends of current user

    return res.status(200).json({success: true, data: null});
  }

  private getCircleList = async (req:Request, res:Response) => {
    let loggedInUser = req.user!.username
    const circles = await this._service.listCircles(loggedInUser)

    res.json({success: true, data: circles})
  }
  
  private acceptInvite = async (req: Request, res: Response) => {
    const { id, invitee } = req.body
    let loggedInUser = req.user!.username
    try {
      if (loggedInUser === invitee) {
        await this._service.acceptInvite(id, invitee)
      }
      return res.status(200).json({success: true, data: null});
    } catch (error) {
      return res.status(200).json({success: false, error: "failed to accept invite"});
    }
  }

  private removeCircleInvite = async (req: Request, res: Response) => {
    try {
      let loggedInUser = req.user!.username
      const { id, invitee } = req.body
      if (loggedInUser === invitee) {
        await this._service.removeRequest(id, invitee)
        res.status(200).json({success:true, data: null})
      } else {
        res.status(400).json({success:false, error: "Failed to accept friend request"})
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}

export default CircleController;