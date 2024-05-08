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
        
        const { albumName, pictureList } = req.body
        console.log(req.body,"logged")
        const newAlbumInput = {
          creator: loggedInUser, 
          name: albumName,
            pictureList: pictureList
          }
          //validate the input before passing it to our db
          
        this._service.createAlbum(newAlbumInput)
        res.status(200).json({ success: true, data:newAlbumInput });
    } catch (err) {
        //throw err;
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
}

export default AlbumController;

export const config = {
  api: {
    bodyParser: false,
  },
};
