import { Request, Response, NextFunction, Router } from "express";
import IController from "../../../interfaces/controller.interface";
import IAlbumService from "../services/IAlbumService";
import { Album } from '@prisma/client'
import { ensureAuthenticated } from "../../../middleware/authentication.middleware";
import { handleUpload } from "../../../helper/HandleSingleUpload";
import multer from 'multer';
import { handleMultipleUpload } from "../../../helper/HandleMultiplePhotos";

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
    this.router.post(`${this.path}/upload`, ensureAuthenticated, upload.single("file"), this.uploadImages); 
    this.router.get(`${this.path}/:id`, ensureAuthenticated, this.showAlbum);
    this.router.post(`${this.path}/list`, ensureAuthenticated, this.getAlbumList);
    this.router.post(`${this.path}/comments`, ensureAuthenticated, this.getComments)
    this.router.post(`${this.path}/comment/new`, ensureAuthenticated, this.newComment)
  }

  private uploadImages = async (req: Request, res: Response) => {
    const b64 = Buffer.from(req.file!.buffer).toString('base64');
    const dataURI = `data:${req.file!.mimetype};base64,${b64}`;
    const cldRes = await handleUpload(dataURI);
    
    res.json({ message: 'File uploaded successfully', data:cldRes.url });
  }

  private createAlbum = async (req:Request, res:Response) => {
    try {
        let loggedInUser = req.user!.username
        
        const { photos, isCircle, name }  = req.body
        console.log(req.body,"logged")
        console.log(isCircle)
        if (!isCircle || !name || !photos.length) {
          throw new Error("missing params")
        }
        if (isCircle) {
          const { id } = req.body;
          console.log(id)
          const albumObj = {
            photos: photos,
            albumName: name,
            circleId: id,
            creator: loggedInUser
          }
          const newAlbum = await this._service.createAlbum(albumObj)
          console.log(newAlbum.id)

          return res.status(200).json({ success: true, data: newAlbum.id})
        }
        res.status(200).json({ success: true, data:null });
    } catch (err) {
        res.status(200).json({success: true, data:null, error: "Failed to create album"})
    }
  }
  
  private showAlbum = async (req:Request, res:Response) => {
    try {
      const { id } = req.params
      console.log(id)
      //ensure user is a member of the circle
      let loggedInUser = req.user!.username
      const member = await this._service.checkMembership(id, loggedInUser)
      if (!member){
        return res.status(200).json({ success: true, data:null });
      }

      const album = await this._service.getAlbum(id)
      // console.log(album)
      res.status(200).json({success: true, data:album});

    } catch (err) {
      throw err;
    }
  }

  private getAlbumList = async (req:Request, res:Response) => {
    let loggedInUser = req.user!.username
    console.log (loggedInUser)
    const albums = await this._service.listAlbums(loggedInUser)

    res.json({success: true, data: albums})
  }

  private getComments = async (req: Request, res: Response) => {
    let loggedInUser = req.user!.username
    try {
      const { albumId } = req.body
      const member = await this._service.checkMembership(albumId, loggedInUser)
      if (!member){
        return res.status(200).json({ success: true, data:null });
      }
      const comments = await this._service.getComments(albumId);
      res.json({success: true, data: comments})
    } catch (err) {

    }
  }

  private newComment = async (req: Request, res: Response) => {
    let loggedInUser = req.user!.username
    try {
      const { message, albumId, commentId } = req.body
      console.log(message, albumId, commentId)
  
      const member = await this._service.checkMembership(albumId, loggedInUser)
      if (!member){
        return res.status(200).json({ success: true, data:null });
      }
      const comment = await this._service.createComment(loggedInUser, message, albumId, commentId);
      res.json({success: true, data: null})
    } catch (err) {
      res.json({success: true, data: null, error: "failed to create comment"})
    }
  }
}

export default AlbumController;

export const config = {
  api: {
    bodyParser: false,
  },
};
