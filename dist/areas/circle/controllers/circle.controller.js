"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../../middleware/authentication.middleware");
const HandleSingleUpload_1 = require("../../../helper/HandleSingleUpload");
const multer_1 = __importDefault(require("multer"));
const getLocalUser_1 = require("../../../helper/getLocalUser");
const exifr_1 = __importDefault(require("exifr"));
const path_1 = __importDefault(require("path"));
const app_1 = require("../../../app");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class CircleController {
    constructor(circleService) {
        this.path = "/circle";
        this.router = (0, express_1.Router)();
        this.uploadImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const b64 = Buffer.from(req.file.buffer).toString('base64');
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                const cldRes = yield (0, HandleSingleUpload_1.handleUpload)(dataURI);
                try {
                    let { latitude, longitude } = yield exifr_1.default.gps(b64);
                    if (cldRes.format === "heic") {
                        cldRes.url = cldRes.url.split(".heic")[0] + ".jpg";
                    }
                    res.json({ message: 'File uploaded successfully', data: { url: cldRes.url, gps: { lat: latitude, long: longitude } } });
                }
                catch (error) {
                    res.json({ message: 'File uploaded successfully', data: { url: cldRes.url, gps: null } });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.createCircle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { circleName, picturePath } = req.body;
                let isPublic = false;
                if (req.body.isPublic === "true") {
                    isPublic = true;
                }
                const newCircleInput = {
                    creator: loggedInUser,
                    name: circleName,
                    picturePath: picturePath,
                    isPublic: isPublic
                };
                const newCircle = yield this._service.createCircle(newCircleInput);
                if (!newCircle) {
                    return res.status(200).json({ success: true, data: newCircle });
                }
                res.status(200).json({ success: true, data: newCircle.id });
            }
            catch (err) {
                return res.status(200).json({ success: true, data: null, error: "failed to create circle" });
            }
        });
        this.deleteCircle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { id } = req.params;
                yield this._service.deleteCircle(id, loggedInUser); //this method also checks if its the owner of the circle, maybe a check should be done separately
                res.status(200).json({ success: true, data: null });
            }
            catch (err) {
                console.log(err);
                return res.status(200).json({ success: true, data: null, error: "failed to delete circle" });
            }
        });
        this.getCircle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //ensure user is a member of the circle
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                console.log(id);
                const publicStatus = yield this._service.checkPublic(id);
                if (!publicStatus) {
                    const member = yield this._service.checkMembership(id, loggedInUser);
                    if (!member) {
                        return res.status(200).json({ success: true, data: null });
                    }
                }
                const circle = yield this._service.getCircle(id);
                const members = yield this._service.getMembers(id);
                return res.status(200).json({ success: true, data: { circle, members } });
            }
            catch (err) {
                return res.status(200).json({ success: true, data: null, error: "unable to get circle" });
            }
        });
        this.circleInvite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            const { requestee, circleId } = req.body;
            const member = yield this._service.checkMembership(circleId, loggedInUser);
            if (!member) {
                return res.status(200).json({ success: true, data: null });
            }
            const circle = yield this._service.inviteToCircle(requestee, circleId);
            if (circle) {
                app_1.io.to(requestee).emit("circleInvite", { user: loggedInUser, circleName: circle });
            }
            //change to verify selected are friends of current user
            return res.status(200).json({ success: true, data: null });
        });
        // private getCircleList = async (req:Request, res:Response) => {
        //   let loggedInUser = await getLocalUser(req, res)
        //   const circles = await this._service.listCircles(loggedInUser)
        //   res.json({success: true, data: circles})
        // }
        this.acceptInvite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, invitee } = req.body;
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            try {
                if (loggedInUser === invitee) {
                    const circle = yield this._service.acceptInvite(id, invitee);
                    for (let member of circle.members) {
                        app_1.io.to(member).emit('acceptCircleInvite', { user: loggedInUser, circleName: circle.circleName });
                    }
                }
                return res.status(200).json({ success: true, data: null });
            }
            catch (error) {
                return res.status(200).json({ success: false, error: "failed to accept invite" });
            }
        });
        this.removeCircleInvite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { id, invitee } = req.body;
                if (loggedInUser === invitee) {
                    yield this._service.removeRequest(id, invitee);
                    res.status(200).json({ success: true, data: null });
                }
                else {
                    res.status(400).json({ success: false, error: "Failed to remove circle invite" });
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
        this.updateCircle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { circleId, circleImg, circleName, isPublic } = req.body;
                if (!circleId || !circleImg || !circleName || typeof isPublic !== "boolean") {
                    return res.status(200).json({ success: true, data: null, error: "missing parameters" });
                }
                const circleObj = {
                    circleId,
                    circleImg,
                    circleName,
                    isPublic
                };
                const circle = yield this._service.updateCircle(loggedInUser, circleObj); //this checks for ownership
                for (let member of circle.members) {
                    if (member !== loggedInUser) {
                        app_1.io.to(member).emit("updateCircle", { user: loggedInUser, circleName: circle.name });
                    }
                }
                res.status(200).json({ success: true, data: circle.id });
            }
            catch (err) {
                console.log(err);
                res.status(200).json({ success: true, data: null, error: "failed to update circle" });
            }
        });
        this.mod = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { member, circleId } = req.body;
                if (!member || !circleId) {
                    return res.status(200).json({ success: true, data: null, error: "missing parameters" });
                }
                const modHelper = { loggedInUser, member, circleId };
                yield this._service.mod(modHelper); //this checks ownership, toggles mod status
                return res.status(200).json({ success: true });
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, error: "failed to mod/unmod" });
            }
        });
        this.removeUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { member, circleId } = req.body;
                if (!member || !circleId) {
                    return res.status(200).json({ success: true, data: null, error: "missing parameters" });
                }
                const userHelper = { loggedInUser, member, circleId };
                yield this._service.removeUser(userHelper); //this checks ownership, toggles mod status
                return res.status(200).json({ success: true });
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, error: "failed to remove user" });
            }
        });
        this.createShareLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { circleId } = req.body;
                if (!circleId) {
                    return res.status(200).json({ success: true, data: null, error: "missing parameters" });
                }
                const shareHelper = { loggedInUser, circleId };
                const shareLink = yield this._service.createShareLink(shareHelper); //this checks ownership/mod
                return res.status(200).json({ success: true, data: shareLink });
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, error: "failed to create share link" });
            }
        });
        this.getCircleRestricted = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, accessToken } = req.params;
                if (!id || !accessToken) {
                    return res.status(200).json({ success: true, data: null, error: "invalid request" });
                }
                const shareLink = yield this._service.getCircleWithToken(id, accessToken); //this checks ownership/mod
                return res.status(200).json({ success: true, data: shareLink });
            }
            catch (err) {
                console.log(err);
                res.status(200).json({ success: true, data: null, error: "failed to get circle data" });
            }
        });
        this.sandbox = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.sendFile(path_1.default.join(__dirname, "../../../../public/index.html"));
            return;
        });
        this.initializeRoutes();
        this._service = circleService;
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create`, authentication_middleware_1.ensureAuthenticated, upload.none(), this.createCircle);
        this.router.post(`${this.path}/upload`, authentication_middleware_1.ensureAuthenticated, upload.single("file"), this.uploadImage);
        this.router.get(`${this.path}/:id`, authentication_middleware_1.ensureAuthenticated, this.getCircle);
        this.router.post(`${this.path}/:id/delete`, authentication_middleware_1.ensureAuthenticated, this.deleteCircle);
        this.router.post(`${this.path}/invite`, authentication_middleware_1.ensureAuthenticated, this.circleInvite);
        // this.router.post(`${this.path}/list`, ensureAuthenticated, this.getCircleList);
        this.router.post(`${this.path}/accept`, authentication_middleware_1.ensureAuthenticated, this.acceptInvite);
        this.router.post(`${this.path}/decline`, authentication_middleware_1.ensureAuthenticated, this.removeCircleInvite);
        this.router.post(`${this.path}/update`, authentication_middleware_1.ensureAuthenticated, this.updateCircle);
        this.router.post(`${this.path}/mod`, authentication_middleware_1.ensureAuthenticated, this.mod);
        this.router.post(`${this.path}/user/remove`, authentication_middleware_1.ensureAuthenticated, this.removeUser);
        this.router.post(`${this.path}/shareLink/create`, authentication_middleware_1.ensureAuthenticated, this.createShareLink);
        this.router.get(`${this.path}/:id/view/:accessToken`, this.sandbox);
        this.router.post(`${this.path}/:id/view/:accessToken/`, this.getCircleRestricted);
    }
}
exports.default = CircleController;
