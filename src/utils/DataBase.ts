import mongoose, { connect } from "mongoose";
import { ImagesModel } from "../models/ImagesModel";
import { Compress, Decompress } from './tools/pako';

export class DataBase{
    DB!: typeof import("mongoose");
    constructor(url:string){
        this.init(url).then(()=>{
            console.log(`success: connect to  ${url}`)
        }).catch(()=>{
            console.log(`error: can't connect to ${url}`)
        })
    }
    async init(url:string): Promise<void>{
        this.DB = await connect(url)
    }

    static async SaveNewImage(imageCode: any): Promise<any>{
        let now = new Date();
        let imagename: string = `${now.getFullYear()}${now.getMonth()}${now.getDay()}_${now.getHours()}${now.getMinutes()}_${now.getSeconds()}`;
        //console.log(imagename);
        //轉碼，從base64轉成2進制(imageData)
        // let imageData 
        // try{
        //     imageData = new Uint8Array(Buffer.from(imageCode, 'base64'));
        // }catch(e){
        //     console.log(`Buffer imagecode fail, ${e}`)
        // }

        //console.log(`imageCode = ${imageCode} (string)`);

        try{
            const image = new ImagesModel({
                imagesBase64Code: imageCode,
                imageName: imagename,     
            });
            console.log(`save image success`);
            await image.save();
        }catch(e){
            console.log(`SaveNewImage fail: ${e}`)          
        }
    }
    
}