import express from "express";
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
  }
 
  private showLandingPage = (_: express.Request, res: express.Response) => {
    res.render(path.join(__dirname, "../../../../public/index.html"));
    return;
  };
}

export default LandingController;
