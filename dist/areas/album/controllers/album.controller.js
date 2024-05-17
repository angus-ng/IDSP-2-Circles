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
const HandleSingleUpload_1 = require("../../../helper/HandleSingleUpload");
const multer_1 = __importDefault(require("multer"));
const getLocalUser_1 = require("../../../helper/getLocalUser");
const javascript_time_ago_1 = __importDefault(require("javascript-time-ago"));
const en_1 = __importDefault(require("javascript-time-ago/locale/en"));
javascript_time_ago_1.default.addLocale(en_1.default);
const timeAgo = new javascript_time_ago_1.default("en");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class AlbumController {
    constructor(albumService) {
        this.path = "/album";
        this.router = (0, express_1.Router)();
        this.uploadImages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const cldRes = yield (0, HandleSingleUpload_1.handleUpload)(dataURI);
            res.json({ message: 'File uploaded successfully', data: cldRes.url });
        });
        this.createAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const { photos, isCircle, name } = req.body;
                console.log(req.body, "logged");
                console.log(isCircle);
                if (!isCircle || !name || !photos.length) {
                    throw new Error("missing params");
                }
                if (isCircle) {
                    const { id } = req.body;
                    console.log(id);
                    const albumObj = {
                        photos: photos,
                        albumName: name,
                        circleId: id,
                        creator: loggedInUser
                    };
                    const newAlbum = yield this._service.createAlbum(albumObj);
                    console.log(newAlbum.id);
                    return res.status(200).json({ success: true, data: newAlbum.id });
                }
                res.status(200).json({ success: true, data: null });
            }
            catch (err) {
                res.status(200).json({ success: true, data: null, error: "Failed to create album" });
            }
        });
        this.showAlbum = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(id);
                //ensure user is a member of the circle
                let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
                const member = yield this._service.checkMembership(id, loggedInUser);
                if (!member) {
                    return res.status(200).json({ success: true, data: null });
                }
                const album = yield this._service.getAlbum(id);
                // console.log(album)
                res.status(200).json({ success: true, data: album });
            }
            catch (err) {
                throw err;
            }
        });
        this.getAlbumList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            console.log(loggedInUser);
            const albums = yield this._service.listAlbums(loggedInUser);
            res.json({ success: true, data: albums });
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            try {
                const { albumId } = req.body;
                const member = yield this._service.checkMembership(albumId, loggedInUser);
                if (!member) {
                    return res.status(200).json({ success: true, data: null });
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
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            try {
                const { message, albumId, commentId } = req.body;
                console.log(message, albumId, commentId);
                const member = yield this._service.checkMembership(albumId, loggedInUser);
                if (!member || !message || message === "") {
                    return res.status(200).json({ success: true, data: null });
                }
                const comment = yield this._service.createComment(loggedInUser, message, albumId, commentId);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to create comment" });
            }
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            try {
                const { commentId } = req.body;
                yield this._service.deleteComment(loggedInUser, commentId);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to delete comment" });
            }
        });
        this.likeComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let loggedInUser = yield (0, getLocalUser_1.getLocalUser)(req, res);
            try {
                const { commentId } = req.body;
                yield this._service.likeComment(loggedInUser, commentId);
                res.json({ success: true, data: null });
            }
            catch (err) {
                res.json({ success: true, data: null, error: "failed to like comment" });
            }
        });
        this.initializeRoutes();
        this._service = albumService;
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create`, authentication_middleware_1.ensureAuthenticated, upload.none(), this.createAlbum);
        this.router.post(`${this.path}/upload`, authentication_middleware_1.ensureAuthenticated, upload.single("file"), this.uploadImages);
        this.router.get(`${this.path}/:id`, authentication_middleware_1.ensureAuthenticated, this.showAlbum);
        this.router.post(`${this.path}/list`, authentication_middleware_1.ensureAuthenticated, this.getAlbumList);
        this.router.post(`${this.path}/comments`, authentication_middleware_1.ensureAuthenticated, this.getComments);
        this.router.post(`${this.path}/comment/new`, authentication_middleware_1.ensureAuthenticated, this.newComment);
        this.router.post(`${this.path}/comment/delete`, authentication_middleware_1.ensureAuthenticated, this.deleteComment);
        this.router.post(`${this.path}/comment/like`, authentication_middleware_1.ensureAuthenticated, this.likeComment);
    }
}
exports.default = AlbumController;
exports.config = {
    api: {
        bodyParser: false,
    },
};
