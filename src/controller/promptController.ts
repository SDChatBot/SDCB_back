import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiAnswer } from '../utils/opanaiApi';

export class PromptController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`this is prompt get, use post in this url is FINE !`);
    }
    public GenerPicPrompt(Request:Request, Response:Response){
        const userPrompt: string = Request.body.prompt || `a Hotdog`;
        //console.log(`userPrompt = ${JSON.stringify(userPrompt)}`);

        const funcPrompt: string = ` 對於${userPrompt}，用英文創建100字上下，可由AI圖像生成器用來創建圖像的詳細描述 `
        AiAnswer(funcPrompt).then((prompt: string | null) => {
            //console.log(`pic prompt = ${prompt}`);
            Response.send({ imagePrompt: `${prompt}` });
        })
    }
}