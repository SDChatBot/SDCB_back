import { VoiceController } from "../controller/voiceController";
import { Route } from "../interfaces/Route";

export class VoiceRoute extends Route {
    protected url: string = '';
    protected Controller = new VoiceController;
    constructor() {
        super()
        this.url = '/voice';
        this.setRoutes();
    }

    //http://localhost:7943/voice
    protected setRoutes(): void {
        this.router.get(`${this.url}`,this.Controller.test);
    }
}