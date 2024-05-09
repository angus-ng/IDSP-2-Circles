import 'dotenv/config'
import App from "./app";
import AuthenticationController from "./areas/authentication/controllers/Authentication.controller";
import { AuthenticationService } from "./areas/authentication/services/Authentication.service";
import LandingController from "./areas/landing/controllers/Landing.controller";
import CircleController from "./areas/circle/controllers/circle.controller";
import { CircleService } from "./areas/circle/services";
// import SettingController from "./areas/settings/controllers/setting.controller";
// import { SettingService } from "./areas/settings/services";
import { AlbumService } from './areas/album/services';
import AlbumController from './areas/album/controllers/album.controller';
import UserController from './areas/user/controller/user.controller';
import { UserService } from './areas/user/services';
// import SearchController from "./areas/search/controllers/search.controller";
// import { SearchService } from "./areas/search/services";


const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key:  process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const server = new App([
  new LandingController(),
  new AuthenticationController(new AuthenticationService()),
  new CircleController(new CircleService()),
  new AlbumController(new AlbumService()),
  new UserController(new UserService()),
  // new SearchController(new SearchService())
  // new SettingController(new SettingService()),
]);
console.log(new UserController(new UserService()), new UserService())

server.start();
