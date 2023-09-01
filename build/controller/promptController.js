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
        const userPrompt = Request.body.prompt || `a Hotdog`;
        //console.log(`userPrompt = ${JSON.stringify(userPrompt)}`);
        const funcPrompt = ` 對於${userPrompt}，用英文創建100字上下，可由AI圖像生成器用來創建圖像的詳細描述 `;
        (0, opanaiApi_1.AiAnswer)(funcPrompt).then((prompt) => {
            //console.log(`pic prompt = ${prompt}`);
            Response.send({ imagePrompt: `${prompt}` });
        });
    }
}
exports.PromptController = PromptController;
