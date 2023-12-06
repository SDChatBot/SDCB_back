"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptController = void 0;
const Controller_1 = require("../interfaces/Controller");
const opanaiApi_1 = require("../utils/opanaiApi");
class PromptController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`this is prompt get, use post in this url is FINE !`);
    }
    GenerPicPrompt(Request, Response) {
        console.log(`body = ${JSON.stringify(Request.body)}`);
        const userPrompt = Request.body.prompt || `a Hotdog`;
        console.log(`userPrompt = ${userPrompt}`);
        (0, opanaiApi_1.AiCreatePicPrompt)(userPrompt).then((prompt) => {
            //console.log(`pic prompt = ${prompt}`);
            Response.send({ imagePrompt: `${prompt}` });
        }).catch((e) => {
            console.log(`AiCreatePicPrompt error: ${e}`);
        });
    }
}
exports.PromptController = PromptController;
