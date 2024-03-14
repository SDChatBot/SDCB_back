"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model3DController = void 0;
const Controller_1 = require("../interfaces/Controller");
class Model3DController extends Controller_1.Controller {
    test(Request, Response) {
        // console.log(`comfyWorkflows: ${comfyWorkflows.Model3D_workflow2}`);
        Response.send(`Hello 3D`);
    }
    uploadImageInComfyui(Request, Response) {
    }
}
exports.Model3DController = Model3DController;
