import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import IAlbumService from "../services/IAlbumService";
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import multer from 'multer';
import { getLocalUser } from "../../../helper/getLocalUser";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { io } from '../../../app';

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
    this.router.post(`${this.path}/:id/addPhotos`, ensureAuthenticated, this.addPhotos);
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.showAlbum);
    // this.router.post(`${this.path}/list`, ensureAuthenticated, this.getAlbumList);
    this.router.post(`${this.path}/like`, ensureAuthenticated, this.likeAlbum);
    this.router.post(`${this.path}/comments`, ensureAuthenticated, this.getComments);
    this.router.post(`${this.path}/comment/new`, ensureAuthenticated, this.newComment);
    this.router.post(`${this.path}/comment/delete`, ensureAuthenticated, this.deleteComment);
    this.router.post(`${this.path}/comment/like`, ensureAuthenticated, this.likeComment);
    this.router.post(`${this.path}/:id/delete`, ensureAuthenticated, this.deleteAlbum);
    this.router.post(`${this.path}/photo/:id/delete`, ensureAuthenticated, this.deletePhoto);
    this.router.post(`${this.path}/update`, ensureAuthenticated, this.updateAlbum)
  }

  private createAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { photos, isCircle, name, location } = req.body
      if (!isCircle || !name || !photos.length) {
        throw new Error("missing params")
      }
      const { id } = req.body;
      const albumObj = {
        photos: photos,
        albumName: name,
        circleId: id,
        creator: loggedInUser,
        location: location
      }
      const member = await this._service.checkMembership(id, loggedInUser, true)
      if (!member) {
        return res.status(200).json({ success: true, data: null });
      }
      const newAlbum = await this._service.createAlbum(albumObj)
      if (newAlbum) {
        for (let user of newAlbum.members) {
          if (user !== loggedInUser) {
            io.to(user).emit("newAlbum", { user: newAlbum.user, circleName: newAlbum.circleName })
          }
        }
        return res.status(200).json({ success: true, data: newAlbum.id })
      } else {
        res.status(200).json({ success: true, data: null, error: "You're not a user" })
      }
    } catch (err) {
      res.status(200).json({ success: true, data: null, error: "Failed to create album" })
    }
  }

  private addPhotos = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { photos } = req.body;
      if (!Array.isArray(photos) || photos.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid photos array" });
      }

      let loggedInUser = await getLocalUser(req, res);
      const member = await this._service.checkMembership(id, loggedInUser);
      if (!member) {
        return res.status(403).json({ success: false, error: "User is not a member of this album" });
      }

      const updatedAlbum = await this._service.addPhotos(loggedInUser, id, photos);
      if (!updatedAlbum) {
        return res.status(404).json({ success: false, error: "Album not found" });
      }
      //@ts-ignore
      const members = updatedAlbum.album.circle.UserCircle.map((obj => obj.user.username))
     for (let user of members) {
      if (user !== loggedInUser) {
        io.to(user).emit("updateAlbum", { user: loggedInUser, albumName: updatedAlbum.album.name, photoCount: photos.length })
      }
     }

      res.status(200).json({ success: true, data: updatedAlbum.newPhotos });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Error updating album" });
    }
  }

  private likeAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { albumId } = req.body;
      const liked = await this._service.likeAlbum(loggedInUser, albumId);
      if (liked) {
        for (let user of liked.members) {
          if (user !== loggedInUser) {
            io.to(user).emit("likeAlbum", { user: liked.user, albumName: liked.albumName })
          }
        }
      }
      res.json({ success: true, data: null });
    } catch (err) {
      console.log(err)
      res.json({ success: true, data: null, error: "failed to like album" });
    }
  }

  private showAlbum = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      //ensure its public / user is a member of the circle
      let loggedInUser = await getLocalUser(req, res)
      const publicStatus = await this._service.checkPublic(id)
      if (!publicStatus) {
        const member = await this._service.checkMembership(id, loggedInUser)
        if (!member) {
          return res.status(200).json({ success: true, data: null });
        }
      }

      const album = await this._service.getAlbum(id);
      res.status(200).json({ success: true, data: album });

    } catch (err) {
      res.status(200).json({ success: true, data: null, err: "Could not fetch album" })
    }
  }

  private getComments = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
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
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { message, albumId, commentId } = req.body;
      const publicStatus = await this._service.checkPublic(albumId)
      if (!publicStatus) {
        const member = await this._service.checkMembership(albumId, loggedInUser);
        if (!member) {
          return res.status(200).json({ success: true, data: null });
        }
      }
      if (!message || message === "") {
        return res.status(200).json({ success: true, data: null });
      }
      const comment = await this._service.createComment(loggedInUser, message, albumId, commentId);
      if (comment.owner !== comment.user && comment.parentUser !== comment.user) {
        if (comment.parentUser) {
          io.to(comment.parentUser).emit("newCommentReply", { user: comment.user, albumName: comment.albumName, parentUser: comment.parentUser })
        }
        io.to(comment.owner).emit("newComment", { user: comment.user, albumName: comment.albumName, owner: comment.owner })
      } else if (comment.parentUser) {
        if (comment.parentUser !== comment.user) {
          io.to(comment.parentUser).emit("newCommentReply", { user: comment.user, albumName: comment.albumName, parentUser: comment.parentUser })
        }
      }
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to create comment" });
    }
  }

  private deleteComment = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { commentId } = req.body;

      await this._service.deleteComment(loggedInUser, commentId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to delete comment" });
    }
  }

  private likeComment = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { commentId } = req.body;
      const data = await this._service.likeComment(loggedInUser, commentId);
      if (data) {
        if (data.owner && data.owner !== loggedInUser) {
          io.to(data.owner).emit("likeComment", { user: data.user, albumName: data.albumName })
        }
      }
      res.json({ success: true, data: null });
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to like comment" });
    }
  }

  private deleteAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { id } = req.params
      await this._service.deleteAlbum(id, loggedInUser);
      res.json({ success: true, data: null })
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to delete album" });
    }
  }

  private deletePhoto = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { id } = req.params
      await this._service.deletePhoto(id, loggedInUser);
      res.json({success: true, data: null})
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to delete photo" });
    }
  }

  private updateAlbum = async (req: Request, res: Response) => {
    try {
      let loggedInUser = await getLocalUser(req, res)
      const { albumId, albumName } = req.body
      await this._service.updateAlbum(albumId, albumName, loggedInUser)
      res.json({ success: true, data: null })
    } catch (err) {
      res.json({ success: true, data: null, error: "failed to update album" })
    }
  }
}

export default AlbumController;

export const config = {
  api: {
    bodyParser: false,
  },
};
