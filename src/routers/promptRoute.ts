import { PromptController } from "../controller/promptController";
import { Route } from "../interfaces/Route";

export class PromptRoute extends Route {
    protected url: string;
    protected Controller = new PromptController;
    constructor() {
        super()
        this.url = '';
        this.setRoutes()
    }

    //http://localhost:7943/prompt
    //http://192.168.1.26/prompt
    protected setRoutes(): void {
        this.router.get(`${this.url}/prompt`, this.Controller.test)
        this.router.post(`${this.url}/prompt`, this.Controller.GenerPicPrompt)
    }
}