import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { fetchImage } from "../utils/tools/fetch";
import { DataBase } from "../utils/DataBase";
// import { saveBase64Image } from "../utils/tools/saveImage";

import fs from 'fs';
import path from 'path';

import { GenImg_prompt_1st_2nd } from "../utils/tools/images/LLM_fetch_images";

export class ImageController extends Controller {
    public test(Request:Request, Response:Response){
        Response.send(`Hello imageRoute`)
    }

    //用來測試任何功能()
    public async test2(Request:Request, Response:Response){
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
    public async LLMGenImgPrompt(Request:Request, Response:Response){
        // console.log(`imageData = ${JSON.stringify(Request.body.imagePrompt)}`);
        // 第一次生成
        let story_1st:string = ""
        let payload1 = {
            "model": "codegemma:latest",
            "prompt": `請你用繁體中文幫我生成一篇關於${Request.body.imagePrompt}的適合小孩子的故事，請你以以下格式回答我的問題: {故事內容}`,
            "stream": false,
            "format": "json"
        }
        GenImg_prompt_1st_2nd(payload1).then(response => {
            // console.log(`response = ${response}`);
            story_1st = response;
        }).catch(error => {
            console.error(`Error in GenImg_prompt_1st_2nd 1: ${error}`);
            Response.status(500).send('Internal Server Error');
        });

        // 第二次生成
        let payload2 = {
            "model": "codegemma:latest",
            "prompt": `請你幫我檢視並修改以下故事，確保他是適合小朋友的故事: ${story_1st}`,
            "stream": false,
            "format": "json"
        }
        GenImg_prompt_1st_2nd(payload2).then(response => {
            // console.log(`response = ${response}`);
            if(story_1st !="")
                Response.send(response);
        }).catch(error => {
            console.error(`Error in GenImg_prompt_1st_2nd 2: ${error}`);
            Response.status(500).send('Internal Server Error');
        });
    }

    /** 使用SD 生成圖片
     * @param {string} Request.body.imagePrompt 想生成的故事內容
     * @param {string} Response 圖片生成完畢後先暫時不返回東西，僅返回success
     * @todo 修改使其返回圖片的 base64 編碼
     * url: http://localhost:7943/image
     * Request body 
     * {
            "imagePrompt":"喜歡狗狗，想要生成關於狗狗的故事"
       }

     * 獲得sd model list: get, http://163.13.201.153:7860/sdapi/v1/sd-models
     */
    public async getImage(Request: Request, Response: Response) {
        const imageData = Request.body;
        console.log(`imageData = ${JSON.stringify(imageData)}`);
        let payload = {
            "prompt": imageData.imagePrompt,
            "seed": -1,
            "width": 1920,
            "height": 1080,
            "cfg_scale": 7,
            "step": 8,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
            "override_settings" : {
                "sd_model_checkpoint": "v1-5-pruned-emaonly.ckpt"
            }
        }
        try {
            fetchImage(payload).then((val) => {
                Response.send("success")
            }).catch((e) => {
                console.error(`run time error`)
            })
        } catch (e) {
            console.log(`fetchImage fail: ${e}`)
            Response.status(500).send('/image post run wrong ');
        }
    }










































    //拿圖片的prompt
    public getimageprmopt(request: Request, response: Response) {
        const imageData = request.body;
        let payload = {
            "prompt": imageData.imagepropmts,
            "seed": -1,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        }
        try {
            fetchImage(payload).then((val) => { //val就是image base64 code
                try {
                    //saveBase64Image(`${val["0"]}`, "test.png")
                    // const keys = Object.keys(val);
                    // console.log(keys);
                    // saveBase64Image(val["0"], "test.png");
                    // response.send(val["0"]);
                } catch (e) {
                    console.error(`Error saving image: ${e}`)
                }
            }).catch((e) => {
                console.log(`Runtime error: ${e}`)
            })
        } catch (e) {
            console.log(`FetchImage error: ${e}`)
            response.status(500).send('/image post run wrong ');
        }
    }

    //拿本地圖片
    public getLocalpic(request:Request, response:Response){
        const filename = `${request.query.picnum}.png`; // 文件名
        const filePath = path.join(`D:/NewCodeFile/SDCB/GitHub_SDCB/demobooks`, `${request.query.story_id}`,filename); // 文件的绝对路径

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                response.status(500).send('Failed to read file');
            } else {
                response.setHeader('Content-Type', 'image/png'); // 设置响应头部为 png 图片类型
                response.send(data); // 发送响应正文（图片数据）
            }
        });
    }

    //從本地拿取故事的聲音
    public getStoryVoice(request: Request, response: Response) {
        const filename = `${request.query.picnum}.mp3`; // 文件名
        const filePath = path.join(
            `D:/NewCodeFile/SDCB/GitHub_SDCB/voices`,
            `${request.query.story_id}`,
            filename
        ); // 文件的绝对路径

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                response.status(500).send('Failed to read file');
            } else {
                response.setHeader('Content-Type', 'audio/mpeg');
                response.send(data);
            }
        });
    }
}