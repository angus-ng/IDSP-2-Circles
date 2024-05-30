import 'dotenv/config'
import CircleController from "./areas/circle/controllers/circle.controller";
import App from "./app";
// import PostController from "./areas/post/controllers/post.controller";
import AuthenticationController from "./areas/authentication/controllers/Authentication.controller";
// import { MockAuthenticationService } from "./areas/authentication/services/Authentication.service.mock";
// import { PostService } from "./areas/post/services";
import LandingController from "./areas/landing/controllers/Landing.controller";
import { CircleService } from "./areas/circle/services";
// import SettingController from "./areas/settings/controllers/setting.controller";
// import { SettingService } from "./areas/settings/services";
import { AuthenticationService } from "./areas/authentication/services/Authentication.service";
// import SearchController from "./areas/search/controllers/search.controller";
// import { SearchService } from "./areas/search/services";
import AlbumController from './areas/album/controllers/album.controller';
import { AlbumService } from './areas/album/services';
import UserController from './areas/user/controllers/user.controller';
import { UserService } from './areas/user/services';
import { io } from './app';

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key:  process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const server = new App([
  new LandingController(),
  new CircleController(new CircleService()),
  new AlbumController(new AlbumService()),
  new UserController(new UserService()),
  new AuthenticationController(new AuthenticationService()),
  // new SettingController(new SettingService()),
]);

server.start();
