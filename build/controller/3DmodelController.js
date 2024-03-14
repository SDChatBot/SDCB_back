"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmodelController = void 0;
const Controller_1 = require("../interfaces/Controller");
class DmodelController extends Controller_1.Controller {
    test(Request, Response) {
        console.log(`comfyWorkflows: ${"./workflow/Model3D_workflow2.json" /* comfyWorkflows.Model3D_workflow2 */}`);
        Response.send(`Hello 3D`);
    }
}
exports.DmodelController = DmodelController;
