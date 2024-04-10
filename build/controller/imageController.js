"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const Controller_1 = require("../interfaces/Controller");
const fetch_1 = require("../utils/tools/fetch");
// import { saveBase64Image } from "../utils/tools/saveImage";
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fetch_images_1 = require("../utils/tools/LLM/fetch_images");
class ImageController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`Hello imageRoute`);
    }
    //用來測試任何功能()
    test2(Request, Response) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**用LLM 生成故事提示詞(第一次+第二次)
     * @param {string} imagePrompt 想要生成的故事提示詞(使用者輸入)
     * @Response {Promise<string>} LLM 生成傳回來的 JSON 字串
     * @example
     * postman
     * url:  http://127.0.0.1:7943/image/prompt
     * method: POST
     * body-raw-json:
     *  {
            "imagePrompt":"會變身的狗狗"
        }
    */
    LLMGenImgPrompt(Request, Response) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`imageData = ${JSON.stringify(Request.body.imagePrompt)}`);
            // 第一次生成
            let story_1st = "";
            let payload1 = {
                "model": "codegemma:latest",
                "prompt": `請你用繁體中文幫我生成一篇關於${Request.body.imagePrompt}的適合小孩子的模型，請你以以下格式回答我的問題: {故事內容}`,
                "stream": false,
                "format": "json"
            };
            (0, fetch_images_1.GenImg_prompt_1st_2nd)(payload1).then(response => {
                // console.log(`response = ${response}`);
                story_1st = response;
            }).catch(error => {
                console.error(`Error in test2: ${error}`);
                Response.status(500).send('Internal Server Error');
            });
            // 第二次生成
            let payload2 = {
                "model": "codegemma:latest",
                "prompt": `請你幫我檢視並修改以下故事，確保他是和小朋友: ${story_1st}`,
                "stream": false,
                "format": "json"
            };
            (0, fetch_images_1.GenImg_prompt_1st_2nd)(payload2).then(response => {
                // console.log(`response = ${response}`);
                if (story_1st != "")
                    Response.send(response);
            }).catch(error => {
                console.error(`Error in test2: ${error}`);
                Response.status(500).send('Internal Server Error');
            });
        });
    }
    //這邊之後會改，改成從本地端拿圖片
    getImage(Request, Response) {
        const imageData = Request.body;
        // console.log(`imageData = ${JSON.stringify(imageData)}`);
        let payload = {
            "prompt": imageData.imagePrompt,
            "seed": -1,
            "width": 1920,
            "height": 1080,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        };
        try {
            (0, fetch_1.fetchImage)(payload).then((val) => {
                //console.log(val)
                // let imageSaveData = `${val}`
                //console.log(`imageSaveData = ${imageSaveData}`)
                // DataBase.SaveNewImage(imageSaveData);
                // Response.json(val);
                Response.send(val);
            }).catch((e) => {
                console.log(`run time error`);
            });
            //res.send(fetchImage());
        }
        catch (e) {
            console.log(`fetchImage fail: ${e}`);
            Response.status(500).send('/image post run wrong ');
        }
    }
    //拿圖片的prompt
    getimageprmopt(request, response) {
        const imageData = request.body;
        let payload = {
            "prompt": imageData.imagepropmts,
            "seed": -1,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        };
        try {
            (0, fetch_1.fetchImage)(payload).then((val) => {
                try {
                    //saveBase64Image(`${val["0"]}`, "test.png")
                    // const keys = Object.keys(val);
                    // console.log(keys);
                    // saveBase64Image(val["0"], "test.png");
                    // response.send(val["0"]);
                }
                catch (e) {
                    console.error(`Error saving image: ${e}`);
                }
            }).catch((e) => {
                console.log(`Runtime error: ${e}`);
            });
        }
        catch (e) {
            console.log(`FetchImage error: ${e}`);
            response.status(500).send('/image post run wrong ');
        }
    }
    //拿本地圖片
    getLocalpic(request, response) {
        const filename = `${request.query.picnum}.png`; // 文件名
        const filePath = path_1.default.join(`D:/NewCodeFile/SDCB/GitHub_SDCB/demobooks`, `${request.query.story_id}`, filename); // 文件的绝对路径
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                response.status(500).send('Failed to read file');
            }
            else {
                response.setHeader('Content-Type', 'image/png'); // 设置响应头部为 png 图片类型
                response.send(data); // 发送响应正文（图片数据）
            }
        });
    }
    //從本地拿取故事的聲音
    getStoryVoice(request, response) {
        const filename = `${request.query.picnum}.mp3`; // 文件名
        const filePath = path_1.default.join(`D:/NewCodeFile/SDCB/GitHub_SDCB/voices`, `${request.query.story_id}`, filename); // 文件的绝对路径
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                response.status(500).send('Failed to read file');
            }
            else {
                response.setHeader('Content-Type', 'audio/mpeg');
                response.send(data);
            }
        });
    }
}
exports.ImageController = ImageController;
