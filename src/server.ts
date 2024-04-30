import CircleController from "./areas/circle/controllers/circle.controller";
import App from "./app";
// import PostController from "./areas/post/controllers/post.controller";
// import AuthenticationController from "./areas/authentication/controllers/Authentication.controller";
// import { MockAuthenticationService } from "./areas/authentication/services/Authentication.service.mock";
// import { PostService } from "./areas/post/services";
import LandingController from "./areas/landing/controllers/Landing.controller";
import { CircleService } from "./areas/circle/services";
// import SettingController from "./areas/settings/controllers/setting.controller";
// import { SettingService } from "./areas/settings/services";
// import { AuthenticationService } from "./areas/authentication/services/Authentication.service";
// import SearchController from "./areas/search/controllers/search.controller";
// import { SearchService } from "./areas/search/services";

const server = new App([
  new LandingController(),
  new CircleController(new CircleService),
  // new PostController(new PostService()),
  // new AuthenticationController(new AuthenticationService()),
  // new SearchController(new SearchService())
  // new SettingController(new SettingService()),
]);

server.start();
