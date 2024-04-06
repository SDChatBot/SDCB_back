"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const Controller_1 = require("../interfaces/Controller");
const opanaiApi_1 = require("../utils/opanaiApi");
const DataBase_1 = require("../utils/DataBase");
const LLMapi_1 = require("../utils/LLMapi");
class StoryController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`this is STORY get, use post in this url is FINE !`);
        // DataBase.getStoryById("653b89626620dbe005b01bc6").then((storytail)=>{
        // })
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
    //拿最新創建的故事id
    GetNewestStoryID(Request, Response) {
        DataBase_1.DataBase.getNewestId().then((newestId) => {
            Response.send(newestId);
        }).catch((e) => {
            console.log(` GetNewestStoryID fail :${e}`);
        });
    }
    //拿整理好的books (storyId: string; storyName: string;)
    GetBooks(Request, Response) {
        DataBase_1.DataBase.getBooks().then((books) => {
            Response.send(JSON.stringify(books));
        });
    }
    // 拿故事列表(全部)
    //llm generation story
    llmgenStory(Request, Response) {
        (0, LLMapi_1.LLMGenStory)().then(response => {
            Response.send(response);
        }).catch(e => {
            console.error(`llmgenStory fail: ${e}`);
        });
    }
}
exports.StoryController = StoryController;
