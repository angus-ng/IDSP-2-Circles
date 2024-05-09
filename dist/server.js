"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const circle_controller_1 = __importDefault(require("./areas/circle/controllers/circle.controller"));
const app_1 = __importDefault(require("./app"));
// import PostController from "./areas/post/controllers/post.controller";
const Authentication_controller_1 = __importDefault(require("./areas/authentication/controllers/Authentication.controller"));
// import { MockAuthenticationService } from "./areas/authentication/services/Authentication.service.mock";
// import { PostService } from "./areas/post/services";
const Landing_controller_1 = __importDefault(require("./areas/landing/controllers/Landing.controller"));
const services_1 = require("./areas/circle/services");
// import SettingController from "./areas/settings/controllers/setting.controller";
// import { SettingService } from "./areas/settings/services";
const Authentication_service_1 = require("./areas/authentication/services/Authentication.service");
// import SearchController from "./areas/search/controllers/search.controller";
// import { SearchService } from "./areas/search/services";
const album_controller_1 = __importDefault(require("./areas/album/controllers/album.controller"));
const services_2 = require("./areas/album/services");
const user_controller_1 = __importDefault(require("./areas/user/controllers/user.controller"));
const services_3 = require("./areas/user/services");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = new app_1.default([
    new Landing_controller_1.default(),
    new circle_controller_1.default(new services_1.CircleService()),
    new album_controller_1.default(new services_2.AlbumService()),
    // new PostController(new PostService()),
    new user_controller_1.default(new services_3.UserService()),
    new Authentication_controller_1.default(new Authentication_service_1.AuthenticationService()),
    // new SearchController(new SearchService())
    // new SettingController(new SettingService()),
]);
server.start();
