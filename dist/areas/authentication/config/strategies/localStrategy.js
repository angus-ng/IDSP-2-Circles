"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const Authentication_service_1 = require("../../services/Authentication.service");
const db = new Authentication_service_1.AuthenticationService();
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    const userOrErr = db.getUserByEmailAndPassword(email, password);
    if (typeof userOrErr === "string") {
        done(null, false, { message: userOrErr });
    }
    else {
        done(null, userOrErr);
    }
});
const passportLocalStrategy = {
    name: 'local',
    strategy: localStrategy,
};
exports.default = passportLocalStrategy;
