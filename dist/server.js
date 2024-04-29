"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import PostController from "./areas/post/controllers/post.controller";
// import AuthenticationController from "./areas/authentication/controllers/Authentication.controller";
// import { MockAuthenticationService } from "./areas/authentication/services/Authentication.service.mock";
// import { PostService } from "./areas/post/services";
const Landing_controller_1 = __importDefault(require("./areas/landing/controllers/Landing.controller"));
// import SettingController from "./areas/settings/controllers/setting.controller";
// import { SettingService } from "./areas/settings/services";
// import { AuthenticationService } from "./areas/authentication/services/Authentication.service";
// import SearchController from "./areas/search/controllers/search.controller";
// import { SearchService } from "./areas/search/services";
const server = new app_1.default([
    new Landing_controller_1.default(),
    // new PostController(new PostService()),
    // new AuthenticationController(new AuthenticationService()),
    // new SearchController(new SearchService())
    // new SettingController(new SettingService()),
]);
server.start();
