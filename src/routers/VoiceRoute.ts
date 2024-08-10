import { VoiceController } from "../controller/voiceController";
import { Route } from "../interfaces/Route";
import { upload } from "../utils/multer";

export class VoiceRoute extends Route {
    protected url: string = '';
    protected Controller = new VoiceController;
    constructor() {
        super()
        this.url = '/voice';
        this.setRoutes();
    }

    // http://localhost:7943/voice
    // http://localhost:7943/voice/uploadvoices
    protected setRoutes(): void {
        this.router.get(`${this.url}`,this.Controller.test);
        this.router.post(`${this.url}/uploadvoices`,upload.single("file"),this.Controller.UploadVoice);
    }
}