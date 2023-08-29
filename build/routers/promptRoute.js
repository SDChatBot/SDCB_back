"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptRoute = void 0;
const promptController_1 = require("../controller/promptController");
const Route_1 = require("../interfaces/Route");
class PromptRoute extends Route_1.Route {
    constructor() {
        super();
        this.Controller = new promptController_1.PromptController;
        this.url = '';
        this.setRoutes();
    }
    //http://localhost:7943/prompt
    //http://192.168.1.26/prompt
    setRoutes() {
        this.router.get(`${this.url}/prompt`, this.Controller.test);
        this.router.post(`${this.url}/prompt`, this.Controller.GenerPicPrompt);
    }
}
exports.PromptRoute = PromptRoute;
