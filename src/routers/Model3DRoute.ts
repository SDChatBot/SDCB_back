import { Model3DController } from "../controller/Model3DController";
import { Route } from "../interfaces/Route";

import { upload } from "../utils/multer";

export class Model3DRoute extends Route{
   protected url:string;
   protected Controller = new Model3DController;
   constructor(){
      super();
      this.url=''
      this.setRoutes()
   }

   //http://127.0.0.1:7943/model3d
   protected setRoutes(): void {
      this.router.get(`${this.url}/model3d`, this.Controller.test);
      this.router.post(`${this.url}/model3d`, upload.single('file'),this.Controller.uploadImageInComfyui);
   }
}