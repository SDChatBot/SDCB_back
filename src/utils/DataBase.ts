import mongoose, { connect } from "mongoose";
import { ImagesModel } from "../models/ImagesModel";
import { userModel } from "../models/userModel";

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
        try{
            const image = new ImagesModel({
                imagesBase64Code: imageCode,
                imageName: imagename,     
            });
            // console.log(`save image success`);
            await image.save();
        }catch(e){
            console.log(`SaveNewImage fail: ${e}`)          
        }
    }

    static async SaveNewUser(name:string, password:string): Promise<any>{
        try{
            const user = new userModel({
                userName: name,
                userPassword: password,
            });
            // console.log(`save user success)
            await user.save();
        }catch(e){
            console.log(`save user fail: ${e}`);
        }
    }
    
}