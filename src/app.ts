import express from "express";
import errorMiddleware from "./middleware/error.middleware";
import Controller from "./interfaces/controller.interface";
import dotenv from "dotenv";
import path from "node:path";

class App {
  private _app: express.Application;
  private readonly _port: number = Number(process.env.PORT) || 5000;

  constructor(controllers: Controller[]) {
    dotenv.config();

    this._app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public start() {
    this._app.listen(this._port, () => {
      console.log(`App running at: http://localhost:${this._port}/ 🚀`);
    });
  }

  private initializeMiddlewares() {
    require("./middleware/express.middlewares")(this._app);
    // require("./middleware/passport.middlewares")(this._app);
    // require("./middleware/authentication.middlewares")(this._app);
  }

  private initializeErrorHandling() {
    this._app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this._app.use("/", controller.router);
    });
  }
}

export default App;
