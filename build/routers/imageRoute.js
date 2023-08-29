"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRoute = void 0;
const imageController_1 = require("../controller/imageController");
const Route_1 = require("../interfaces/Route");
class ImageRoute extends Route_1.Route {
    constructor() {
        super();
        this.Controller = new imageController_1.ImageController;
        this.url = '';
        this.setRoutes();
    }
    //http://localhost:7943/image
    //http://192.168.1.26/image
    setRoutes() {
        this.router.get(`${this.url}/image`, this.Controller.test);
        this.router.post(`${this.url}/image`, this.Controller.getImage);
    }
}
exports.ImageRoute = ImageRoute;
