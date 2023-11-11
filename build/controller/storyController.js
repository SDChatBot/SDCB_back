"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const Controller_1 = require("../interfaces/Controller");
const opanaiApi_1 = require("../utils/opanaiApi");
const DataBase_1 = require("../utils/DataBase");
class StoryController extends Controller_1.Controller {
    test(Request, Response) {
        //Response.send(`this is STORY get, use post in this url is FINE !`);
        DataBase_1.DataBase.getStoryById("653b89626620dbe005b01bc6").then((storytail) => {
            Response.send(storytail);
        });
    }
    GenerStory(Request, Response) {
        let infoVal = Request.body;
        let storyInfo = Request.body.storyInfo;
        console.log(`Request.body.storyInfo = ${Request.body.storyInfo}`);
        // console.log(`infoVal= ${JSON.stringify(infoVal)}`)
        //生成故事
        (0, opanaiApi_1.AiStory)(infoVal).then((storyTale) => {
            DataBase_1.DataBase.SaveNewStory(storyTale, storyInfo);
            Response.send(`story gener ans save success`);
        });
    }
    //拿資料庫故事
    GeyStoryFDB(Request, Response) {
        let data = Request.query.id;
        DataBase_1.DataBase.getStoryById(data).then((storytail) => {
            // console.log(`storytail = ${storytail}`)
            Response.send(storytail);
        });
    }
}
exports.StoryController = StoryController;
