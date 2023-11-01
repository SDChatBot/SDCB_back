"use strict";
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
class ImageController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`Hello imageRoute`);
    }
    getImage(Request, Response) {
        const imageData = Request.body;
        // console.log(`imageData = ${JSON.stringify(imageData)}`);
        let payload = {
            "prompt": imageData.imagePrompt,
            "seed": -1,
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
