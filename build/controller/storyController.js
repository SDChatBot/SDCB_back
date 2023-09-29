"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const Controller_1 = require("../interfaces/Controller");
const opanaiApi_1 = require("../utils/opanaiApi");
class StoryController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`this is STORY get, use post in this url is FINE !`);
    }
    GenerStory(Request, Response) {
        let infoVal = Request.body;
        // console.log(infoVal)
        (0, opanaiApi_1.AiStory)(infoVal).then((story) => {
            Response.send({ tailStory: story });
        });
    }
    SleepStory(Request, Response) {
        let theme = Request.body;
        // console.log(infoVal)
        (0, opanaiApi_1.AiStory)(theme).then((story) => {
            Response.send({ tailStory: story });
        });
    }
}
exports.StoryController = StoryController;
