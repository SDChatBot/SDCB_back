import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { trainVoice } from "../utils/tools/trainVoiceModel";

export class VoiceController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is VoiceController`);
    }

    public UploadVoice = async(req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const file = req.file;
        const filePath = process.env.dev_saveRecording!; // 存放使用者聲音的目錄
        const audioName = req.body.audioName;
        const fullPath = path.join(filePath, `${audioName}.wav`);

        try{
            fs.rename(file.path, fullPath, (err) => {
                if (err) {
                    console.error(`Error saving file: ${err.message}`);
                    return res.status(500).send("Error saving file.");
                }

                console.log(`File ${audioName} saved successfully in ${filePath}`);
            });
    
            await trainVoice(audioName);
            res.send({code:200, message: "train voice model success"})
        } catch(err:any){
            res.send({code: 500, message: err.message});
        }
    }
}