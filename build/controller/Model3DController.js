"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model3DController = void 0;
const Controller_1 = require("../interfaces/Controller");
const Model3D_workflow2_1 = require("../utils/workflow/Model3D_workflow2");
const multer_1 = require("../utils/multer");
const fetch_1 = require("../utils/tools/fetch");
class Model3DController extends Controller_1.Controller {
    test(Request, Response) {
        // console.log(`comfyWorkflows: ${comfyWorkflows.Model3D_workflow2}`);
        Response.send(`Hello 3D`);
    }
    uploadImageInComfyui(Request, Response) {
        // console.log(`imageName: ${imageName}`);
        let workflow = (0, Model3D_workflow2_1.setImage2Model_workflow2)(multer_1.imageName);
        const queue_prompt = () => {
            let data = { "prompt": workflow };
            // console.log(`data: ${JSON.stringify(data)}`)
            (0, fetch_1.fetchComfy)(data).then(() => {
                console.log("post success");
            }).catch((e) => {
                console.error((`fetchComfy fail with error: ${e}`));
            });
        };
        queue_prompt();
    }
}
exports.Model3DController = Model3DController;
