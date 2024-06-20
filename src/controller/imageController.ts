import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { fetchImage } from "../utils/tools/fetch";
import { DataBase } from "../utils/DataBase";

import fs from 'fs';
import path from 'path';

// import { GenImg_prompt_1st_2nd } from "../utils/tools/images/LLM_fetch_images";

export class ImageController extends Controller {
    public test(Request:Request, Response:Response){
        Response.send(`Hello imageRoute`)
    }

    //用來測試任何功能()
    public async test2(Request:Request, Response:Response){
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

     * 獲得sd model list: get, http://163.13.202.120:7860/sdapi/v1/sd-models
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