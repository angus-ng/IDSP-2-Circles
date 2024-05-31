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
exports.config = void 0;
const express_1 = require("express");
const authentication_middleware_1 = require("../../../middleware/authentication.middleware");
const multer_1 = __importDefault(require("multer"));
const getLocalUser_1 = require("../../../helper/getLocalUser");
const javascript_time_ago_1 = __importDefault(require("javascript-time-ago"));
const en_1 = __importDefault(require("javascript-time-ago/locale/en"));
const app_1 = require("../../../app");
javascript_time_ago_1.default.addLocale(en_1.default);
const timeAgo = new javascript_time_ago_1.default("en");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class AlbumController {
    constructor(albumService) {
        this.path = "/album";
        this.router = (0, express_1.Router)();
        this.createAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { photos, isCircle, name, location } = req.body;
                if (!isCircle || !name || !photos.length) {
                    throw new Error("missing params");
                }
                const { id } = req.body;
                const albumObj = {
                    photos: photos,
                    albumName: name,
                    circleId: id,
                    creator: loggedInUser,
                    location: location
                };
                const member = yield this._service.checkMembership(id, loggedInUser, true);
                if (!member) {
                    return res.status(200).json({ success: true, data: null });
                }
                const newAlbum = yield this._service.createAlbum(albumObj);
                if (newAlbum) {
                    for (let user of newAlbum.members) {
                        if (user !== loggedInUser) {
                            app_1.io.to(user).emit("newAlbum", { user: newAlbum.user, circleName: newAlbum.circleName });
                        }
                    }
                    return res.status(200).json({ success: true, data: newAlbum.id });
                }
                else {
                    res.status(200).json({ success: true, data: null, error: "You're not a user" });
                }
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, error: "Failed to create album" });
            }
        });
        this.addPhotos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { photos } = req.body;
                if (!Array.isArray(photos) || photos.length === 0) {
                    return res.status(400).json({ success: false, error: "Invalid photos array" });
                }
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const member = yield this._service.checkMembership(id, loggedInUser);
                if (!member) {
                    return res.status(403).json({ success: false, error: "User is not a member of this album" });
                }
                const updatedAlbum = yield this._service.addPhotos(loggedInUser, id, photos);
                if (!updatedAlbum) {
                    return res.status(404).json({ success: false, error: "Album not found" });
                }
                //@ts-ignore
                const members = updatedAlbum.album.circle.UserCircle.map((obj => obj.user.username));
                for (let user of members) {
                    if (user !== loggedInUser) {
                        app_1.io.to(user).emit("updateAlbum", { user: loggedInUser, albumName: updatedAlbum.album.name, photoCount: photos.length });
                    }
                }
                res.status(200).json({ success: true, data: updatedAlbum.newPhotos });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ success: false, error: "Error updating album" });
            }
        });
        this.likeAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { albumId } = req.body;
                const liked = yield this._service.likeAlbum(loggedInUser, albumId);
                if (liked) {
                    for (let user of liked.members) {
                        if (user !== loggedInUser) {
                            app_1.io.to(user).emit("likeAlbum", { user: liked.user, albumName: liked.albumName });
                        }
                    }
                }
                res.json({ success: true, data: null });
            }
            catch (err) {
                console.log(err);
                res.json({ success: true, data: null, error: "failed to like album" });
            }
        });
        this.showAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //ensure its public / user is a member of the circle
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const publicStatus = yield this._service.checkPublic(id);
                if (!publicStatus) {
                    const member = yield this._service.checkMembership(id, loggedInUser);
                    if (!member) {
                        return res.status(200).json({ success: true, data: null });
                    }
                }
                const album = yield this._service.getAlbum(id);
                res.status(200).json({ success: true, data: album });
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, err: "Could not fetch album" });
            }
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { albumId } = req.body;
                const publicStatus = yield this._service.checkPublic(albumId);
                if (!publicStatus) {
                    const member = yield this._service.checkMembership(albumId, loggedInUser);
                    if (!member) {
                        return res.status(200).json({ success: true, data: null });
                    }
                }
                let comments = yield this._service.getComments(albumId);
                const formatTimeStamps = (comment) => {
                    comment.createdAt = timeAgo.format(comment.createdAt);
                    if (comment.replies && comment.replies.length > 0) {
                        comment.replies = comment.replies.map((reply) => {
                            reply = formatTimeStamps(reply);
                            return reply;
                        });
                    }
                    return comment;
                };
                comments = comments.map((comment) => {
                    return formatTimeStamps(comment);
                });
                res.status(200).json({ success: true, data: comments });
            }
            catch (err) {
                console.log(err);
            }
        });
        this.newComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { message, albumId, commentId } = req.body;
                const publicStatus = yield this._service.checkPublic(albumId);
                if (!publicStatus) {
                    const member = yield this._service.checkMembership(albumId, loggedInUser);
                    if (!member) {
                        return res.status(200).json({ success: true, data: null });
                    }
                }
                if (!message || message === "") {
                    return res.status(200).json({ success: true, data: null });
                }
                const comment = yield this._service.createComment(loggedInUser, message, albumId, commentId);
                if (comment.owner !== comment.user && comment.parentUser !== comment.user) {
                    if (comment.parentUser) {
                        app_1.io.to(comment.parentUser).emit("newCommentReply", { user: comment.user, albumName: comment.albumName, parentUser: comment.parentUser });
                    }
                    app_1.io.to(comment.owner).emit("newComment", { user: comment.user, albumName: comment.albumName, owner: comment.owner });
                }
                else if (comment.parentUser) {
                    if (comment.parentUser !== comment.user) {
                        app_1.io.to(comment.parentUser).emit("newCommentReply", { user: comment.user, albumName: comment.albumName, parentUser: comment.parentUser });
                    }
                }
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to create comment" });
            }
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { commentId } = req.body;
                yield this._service.deleteComment(loggedInUser, commentId);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to delete comment" });
            }
        });
        this.likeComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { commentId } = req.body;
                const data = yield this._service.likeComment(loggedInUser, commentId);
                if (data) {
                    if (data.owner && data.owner !== loggedInUser) {
                        app_1.io.to(data.owner).emit("likeComment", { user: data.user, albumName: data.albumName });
                    }
                }
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to like comment" });
            }
        });
        this.deleteAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { id } = req.params;
                yield this._service.deleteAlbum(id, loggedInUser);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to delete album" });
            }
        });
        this.deletePhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { id } = req.params;
                yield this._service.deletePhoto(id, loggedInUser);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to delete photo" });
            }
        });
        this.updateAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { albumId, albumName } = req.body;
                yield this._service.updateAlbum(albumId, albumName, loggedInUser);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to update album" });
            }
        });
        this.initializeRoutes();
        this._service = albumService;
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create`, authentication_middleware_1.ensureAuthenticated, upload.none(), this.createAlbum);
        this.router.post(`${this.path}/:id/addPhotos`, authentication_middleware_1.ensureAuthenticated, this.addPhotos);
        this.router.get(`${this.path}/:id`, authentication_middleware_1.ensureAuthenticated, this.showAlbum);
        // this.router.post(`${this.path}/list`, ensureAuthenticated, this.getAlbumList);
        this.router.post(`${this.path}/like`, authentication_middleware_1.ensureAuthenticated, this.likeAlbum);
        this.router.post(`${this.path}/comments`, authentication_middleware_1.ensureAuthenticated, this.getComments);
        this.router.post(`${this.path}/comment/new`, authentication_middleware_1.ensureAuthenticated, this.newComment);
        this.router.post(`${this.path}/comment/delete`, authentication_middleware_1.ensureAuthenticated, this.deleteComment);
        this.router.post(`${this.path}/comment/like`, authentication_middleware_1.ensureAuthenticated, this.likeComment);
        this.router.post(`${this.path}/:id/delete`, authentication_middleware_1.ensureAuthenticated, this.deleteAlbum);
        this.router.post(`${this.path}/photo/:id/delete`, authentication_middleware_1.ensureAuthenticated, this.deletePhoto);
        this.router.post(`${this.path}/update`, authentication_middleware_1.ensureAuthenticated, this.updateAlbum);
    }
}
exports.default = AlbumController;
exports.config = {
    api: {
        bodyParser: false,
    },
};
