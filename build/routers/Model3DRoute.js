"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model3DRoute = void 0;
const Model3DController_1 = require("../controller/Model3DController");
const Route_1 = require("../interfaces/Route");
const multer_1 = require("../utils/multer");
class Model3DRoute extends Route_1.Route {
    constructor() {
        super();
        this.Controller = new Model3DController_1.Model3DController;
        this.url = '';
        this.setRoutes();
    }
    //http://127.0.0.1:7943/model3d
    setRoutes() {
        this.router.get(`${this.url}/model3d`, this.Controller.test);
        this.router.post(`${this.url}/model3d`, multer_1.upload.single('file'), this.Controller.uploadImageInComfyui);
    }
}
exports.Model3DRoute = Model3DRoute;
