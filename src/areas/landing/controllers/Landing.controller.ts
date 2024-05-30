import express from "express";
import { ensureAuthenticated ,forwardAuthenticated } from "../../../middleware/authentication.middleware";
import IController from "../../../interfaces/controller.interface";
import path from "path";

class LandingController implements IController {
  public path = "/";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.showLandingPage);
    this.router.get(`${this.path}googleMapKey`, ensureAuthenticated, this.getGoogleMapKey);
  }
 
  private showLandingPage = (_: express.Request, res: express.Response) => {
    res.render(path.join(__dirname, "../../../../public/index.html"));
    return;
  };
  
  private getGoogleMapKey = (_: express.Request, res: express.Response) => {
    return res.status(200).json({success: true, data: process.env.GOOGLE_MAP_API_KEY});
  };
}

export default LandingController;
