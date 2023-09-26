import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiCreatePicPrompt } from '../utils/opanaiApi';


export class PromptController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`this is prompt get, use post in this url is FINE !`);
    }
    public GenerPicPrompt(Request:Request, Response:Response){
        const userPrompt: string = Request.body.prompt || `a Hotdog`;
        const funcPrompt: string = `${ userPrompt }`;
        AiCreatePicPrompt(funcPrompt).then((prompt: string | null) => {
            //console.log(`pic prompt = ${prompt}`);
            Response.send({ imagePrompt: `${prompt}` });
        })
    }
}