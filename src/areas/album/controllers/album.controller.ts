import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import IAlbumService from "../services/IAlbumService";
import { Album } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleSingleUpload";
import multer from 'multer';
import { handleMultipleUpload } from "../../../helper/HandleMultiplePhotos";
import { getLocalUser } from "../../../helper/getLocalUser";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en");

const storage = multer.memoryStorage();
const upload = multer({ storage });

class AlbumController implements IController {
  public path = "/album";
  public router = Router();
  private _service: IAlbumService;

  constructor(albumService: IAlbumService) {
    this.initializeRoutes();
    this._service = albumService;
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, ensureAuthenticated, upload.none(), this.createAlbum);
    this.router.post(`${this.path}/:id/update`, ensureAuthenticated, this.updateAlbum);
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.showAlbum);
    // this.router.post(`${this.path}/list`, ensureAuthenticated, this.getAlbumList);
    this.router.post(`${this.path}/like`, ensureAuthenticated, this.likeAlbum);
    this.router.post(`${this.path}/comments`, ensureAuthenticated, this.getComments);
    this.router.post(`${this.path}/comment/new`, ensureAuthenticated, this.newComment);
    this.router.post(`${this.path}/comment/delete`, ensureAuthenticated, this.deleteComment);
    this.router.post(`${this.path}/comment/like`, ensureAuthenticated, this.likeComment);
  }

  private createAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)

      const { photos, isCircle, name } = req.body
      console.log(req.body, "logged")
      console.log(isCircle)
      if (!isCircle || !name || !photos.length) {
        throw new Error("missing params")
      }
      const { id } = req.body;
      console.log(id)
      const albumObj = {
        photos: photos,
        albumName: name,
        circleId: id,
        creator: loggedInUser
      }
      const member = await this._service.checkMembership(id, loggedInUser, true)
      if (!member) {
        console.log("SHIT")
        return res.status(200).json({ success: true, data: null });
      }
      console.log(albumObj)
      const newAlbum = await this._service.createAlbum(albumObj)
      console.log(newAlbum.id)

      return res.status(200).json({ success: true, data: newAlbum.id })
    } catch (err) {
      res.status(200).json({ success: true, data: null, error: "Failed to create album" })
    }
  }

  private updateAlbum = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { photos } = req.body;
      console.log(photos)
      if (!Array.isArray(photos) || photos.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid photos array" });
      }

      console.log(id);

      let loggedInUser = await getLocalUser(req, res);
      const member = await this._service.checkMembership(id, loggedInUser);
      if (!member) {
        return res.status(403).json({ success: false, error: "User is not a member of this album" });
      }

      const updatedAlbum = await this._service.updateAlbum(loggedInUser, id, photos);
      if (!updatedAlbum) {
        return res.status(404).json({ success: false, error: "Album not found" });
      }

      console.log(updatedAlbum);

      res.status(200).json({ success: true, data: updatedAlbum });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Error updating album" });
    }
  }

  private likeAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { albumId } = req.body;
      await this._service.likeAlbum(loggedInUser, albumId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to like album" });
    }
  }

  private showAlbum = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      //ensure its public / user is a member of the circle
      let loggedInUser = await getLocalUser(req, res)
      console.log(loggedInUser, id)
      const publicStatus = await this._service.checkPublic(id)
      if (!publicStatus) {
        const member = await this._service.checkMembership(id, loggedInUser)
        if (!member) {
          return res.status(200).json({ success: true, data: null });
        }
      }

      const album = await this._service.getAlbum(id)
      console.log(album)
      res.status(200).json({ success: true, data: album });

    } catch (err) {
      res.status(200).json({ success: true, data: null, err: "Could not fetch album" })
    }
  }

  // private getAlbumList = async (req:Request, res:Response) => {
  //   let loggedInUser = await getLocalUser(req, res)
  //   console.log (loggedInUser)
  //   const albums = await this._service.listAlbums(loggedInUser)

  //   res.json({success: true, data: albums});
  // }

  private getComments = async (req: Request, res: Response) => {
    let loggedInUser = await getLocalUser(req, res)
    try {
      const { albumId } = req.body;
      const publicStatus = await this._service.checkPublic(albumId)
      if (!publicStatus) {
        const member = await this._service.checkMembership(albumId, loggedInUser);
        if (!member) {
          return res.status(200).json({ success: true, data: null });
        }
      }
      let comments: any[] = await this._service.getComments(albumId);
      const formatTimeStamps = (comment: any) => {
        comment.createdAt = timeAgo.format(comment.createdAt);
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = comment.replies.map((reply: any) => {
            reply = formatTimeStamps(reply);
            return reply;
          });
        }
        return comment;
      };

      comments = comments.map((comment: any) => {
        return formatTimeStamps(comment);
      });
      res.status(200).json({ success: true, data: comments });
    } catch (err) {
      console.log(err)
    }
  }

  private newComment = async (req: Request, res: Response) => {
    let loggedInUser = await getLocalUser(req, res)
    try {
      const { message, albumId, commentId } = req.body;
      console.log(message, albumId, commentId);

      const member = await this._service.checkMembership(albumId, loggedInUser);
      if (!member || !message || message === "") {
        return res.status(200).json({ success: true, data: null });
      }
      const comment = await this._service.createComment(loggedInUser, message, albumId, commentId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to create comment" });
    }
  }

  private deleteComment = async (req: Request, res: Response) => {
    let loggedInUser = await getLocalUser(req, res)
    try {
      const { commentId } = req.body;

      await this._service.deleteComment(loggedInUser, commentId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to delete comment" });
    }
  }

  private likeComment = async (req: Request, res: Response) => {
    let loggedInUser = await getLocalUser(req, res)

    try {
      const { commentId } = req.body;
      await this._service.likeComment(loggedInUser, commentId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to like comment" });
    }
  }
}

export default AlbumController;

export const config = {
  api: {
    bodyParser: false,
  },
};
