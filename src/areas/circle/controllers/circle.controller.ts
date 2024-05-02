import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import ICircleService from "../services/ICircleService";
import { Circle } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleUpload";
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
    this.router.get(`${this.path}/create`, ensureAuthenticated, this.showDashboard);
    this.router.post(`${this.path}/create`, ensureAuthenticated, upload.single("circlePicture"), this.createCircle); 
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.showCircle);
    this.router.get(`${this.path}/:id/delete`, ensureAuthenticated, this.deleteCircle);
    this.router.get(`${this.path}/:id/invite`, ensureAuthenticated, this.showInvite);
    this.router.post(`${this.path}/:id/invite`, ensureAuthenticated, this.circleInvite);
  }

  private showDashboard = async (req:Request, res:Response) => {
    res.render('circle/views/dashboard')
  }

  private createCircle = async (req:Request, res:Response) => {
    try {
        let loggedInUser = req.user!.username

        const { circleName } = req.body
        const b64 = Buffer.from(req.file!.buffer).toString('base64');
        const dataURI = `data:${req.file!.mimetype};base64,${b64}`;
        const cldRes = await handleUpload(dataURI);
        const newCircleInput = {
            creator: loggedInUser, 
            name: circleName,
            picturePath: cldRes.url
        }
        
        //validate the input before passing it to our db


        this._service.createCircle(newCircleInput)
        res.send(`<img src=${cldRes.url}>`)   
    } catch (err) {
        throw err;
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
  private showCircle = async (req:Request, res:Response) => {
    try {
      const { id } = req.params

      //ensure user is a member of the circle
      let loggedInUser = req.user!.username
      const member = await this._service.checkMembership(id, loggedInUser)
      if (!member){
        return res.redirect("/")
      }
      
      const circle = await this._service.getCircle(id)
      console.log(circle)
      res.render('circle/views/circle');

    } catch (err) {
      throw err;
    }
  }
  private showInvite = async (req:Request, res:Response) => {
    const { id } = req.params
    //ensure user is a member of the circle
    let loggedInUser = req.user!.username
    const member = await this._service.checkMembership(id, loggedInUser)
    if (!member){
      return res.redirect("/")
    }
    res.render('circle/views/invite')
  }
  
  private circleInvite = async (req:Request, res:Response) => {
    let loggedInUser = req.user!.username

    console.log(req.body)
    
    //change to verify selected are friends of current user


    
    

    res.redirect("/")
  }
}

export default CircleController;

export const config = {
  api: {
    bodyParser: false,
  },
};
