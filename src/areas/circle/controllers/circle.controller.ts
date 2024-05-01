import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import ICircleService from "../services/ICircleService";
import { Circle } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";

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
    this.router.post(`${this.path}/create`, ensureAuthenticated, this.createCircle); 
    this.router.get(`${this.path}/:id`, ensureAuthenticated,);
    this.router.get(`${this.path}/:id/delete`, ensureAuthenticated, this.deleteCircle);
  }

  private showDashboard = async (req:Request, res:Response) => {
    res.render('circle/views/dashboard')
  }

  private createCircle = async (req:Request, res:Response) => {
    try {
        let loggedInUser = "";
        if (req.user) {
          loggedInUser = req.user.username
        }

        const { circleName, circlePicture } = req.body //MODIFY THIS SO IT USES THE PROPER ROUTE INSTEAD WHEN FILE UPLOADING WORKS WITH MULTER

        const newCircleInput = {
            creator: loggedInUser,
            name: circleName,
            picturePath: circlePicture
        }
        
        //validate the input before passing it to our db


        this._service.createCircle(newCircleInput)
        res.send("circle created")   
    } catch (err) {
        throw err;
    }
  }

  private deleteCircle = async (req:Request, res:Response) => {
    try {
      let loggedInUser = "";
      if (req.user) {
        loggedInUser = req.user.username
      }

        const { id } = req.params
        await this._service.deleteCircle(id, loggedInUser)
        res.redirect("/");
    } catch (err) {
        throw err;
    }
  }
  
}

export default CircleController;
