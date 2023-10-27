import mongoose, { connect } from "mongoose";
import { ImagesModel } from "../models/ImagesModel";
import { userModel } from "../models/userModel";
import { myfavoriteModel } from "../models/myfavoriteModel";
import { storyModel } from "../models/storyModel";
import { Client } from "socket.io/dist/client";

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

    static async SaveNewStory(storyTale: string, storyInfo: string):Promise<any>{
        try{
            const story = new storyModel({
                storyTale: storyTale,
                storyInfo: storyInfo,
                
            })
            console.log(`save newstory success`);
            await story.save();
        }catch(e){
            console.log(`SaveNewStory fail, error:${e}`);
        }
    }

    static async getStoryById(_id:string):Promise<object | any>{
        try{
            const storytail = await storyModel.findOne({_id});
            console.log(typeof storytail)
            return storytail;
        }catch(e){
            console.log(`getStoryById fail, ${e}`)
        }
    }

    // static async SaveNewUser(name:string, password:string): Promise<any>{
    //     try{
    //         const user = new userModel({
    //             userName: name,
    //             userPassword: password,
    //         });
    //         // console.log(`save user success)
    //         await user.save();
    //     }catch(e){
    //         console.log(`save user fail: ${e}`);
    //     }
    // }

    // static async SaveNewMyFavorite(Name: string, is_favorite: boolean, tag: string): Promise<any>{
    //     let addtime = new Date();
    //     let imagename: string = `${addtime.getFullYear()}${addtime.getMonth()}${addtime.getDay()}_${addtime.getHours()}${addtime.getMinutes()}_${addtime.getSeconds()}`;
    //     try{
    //         const myfavorite = new myfavoriteModel({
    //             imageName: Name, 
    //             is_favorite: is_favorite, 
    //             tagName: tag,
    //         });
    //         await myfavorite.save();
    //     }catch(e){
    //         console.log(`SaveNewMyFavorite fail: ${e}`)
    //     }
    // }
    
}