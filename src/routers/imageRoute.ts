import { ImageController } from "../controller/imageController";
import { Route } from "../interfaces/Route";

export class ImageRoute extends Route{
    protected url:string;
    protected Controller = new ImageController;
    constructor(){
        super()
        this.url = '';
        this.setRoutes()
    }

    //http://localhost:7943/image
    //http://192.168.1.26/image
    protected setRoutes():void{
        this.router.get(`${this.url}/image`,this.Controller.test);
        this.router.post(`${this.url}/image`, this.Controller.getImage);
        this.router.post(`${this.url}/postimageprompt`, this.Controller.getimageprmopt);
    }
}