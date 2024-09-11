import { connect } from "mongoose";
import { userModel } from "../models/userModel";
import { storyModel } from "../models/storyModel";
import { CurrentTime } from "./tools/tool";
import { userInterface } from "../interfaces/userInterface";

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

    static async SaveNewStory_returnID(storyTale: string, storyInfo: string):Promise<any>{
        try{
            const newstory = new storyModel({
                storyTale: storyTale,
                storyInfo: storyInfo,   
                is_favorite:false,    
                addDate: CurrentTime(),
            })
            console.log(`save newstory success`);
            await newstory.save();

            const newStoryId = newstory._id;
            return newStoryId;

        }catch(e){
            console.log(`SaveNewStory fail, error:${e}`);      
        }
    }

    //用ID 拿書(單一一本)
    static async getStoryById(_id:string):Promise<object | any>{
        try{
            const storyTale = await storyModel.findOne({_id});
            // console.log(typeof storyTale)
            return storyTale;
        }catch(e){
            console.log(`getStoryById fail, ${e}`)
        }
    }

    // 用使用者id 拿sdtory list
    static async getstoryList(userId: string): Promise<any> {
        try {
            let returnValue: any = await userModel.findById(userId); // 使用 findById 根据 _id 查询
            if (!returnValue) {
                return { success: false, message: 'getstoryList fail, user not found' };
            }
            let returnValue_booklist: userInterface['booklist'] = returnValue.booklist!;
            console.log(`getstoryList returnValue_booklist = ${JSON.stringify(returnValue_booklist)}`);
            return { success: true, message: "getstoryList success", value: returnValue_booklist };
        } catch (e:any) {
            return { success: false, message: `getstoryList fail ${e.message}` };
        }
    }


    static async Update_StoryImagePrompt(_id: string, imagePrompt: string[]):Promise<object | any>{
        try{
            await storyModel.findOneAndUpdate(
                { _id },
                { $set: { image_prompt: imagePrompt } },
                // { new: true }
            );
            console.log(`Success update id ${_id} story's image_prompt array`);
        }catch(e){
            console.log(`Update_StoryImagePrompt fail, ${e}`)
        }
    }

    static async Update_StoryImage_Base64(_id: string, imageBase64: string[]): Promise<object | any> {
        try {
            await storyModel.findOneAndUpdate(
                { _id },
                { $set: { image_base64: imageBase64 } },
                // { new: true }
            );
            console.log(`Success update id ${_id} story's image_base64 array`);
        } catch (e) {
            console.log(`Update_StoryImage_Base64 fail, ${e}`)
        }
    }

    // TODO 拿全部的書籍(array)


    //TODO 設定書本是否為喜歡的書籍(修改books is_favorite)

    //TODO 確認名字是否為唯一，是的話存入資料庫中
    static async isNameTaken(name:string):Promise<boolean>{
        const user = await userModel.findOne({ userName:name });
        return user !== null;
    }

    static async VerifyUser(userName: string, userPassword: string): Promise<{ success: boolean; userId?: string; message: string }> {
        try {
            const user = await userModel.findOne({ userName: userName });
            if (!user) {
                return { success: false, message: "用戶不存在" };
            }
            
            if (user.userPassword !== userPassword) {
                return { success: false, message: "密碼錯誤" };
            }
            
            return { success: true, userId: user._id.toString(), message: "認證成功" };
        } catch (error: any) {
            console.error(`認證用戶時發生錯誤：${error.message}`);
            return { success: false, message: "認證過程中發生錯誤" };
        }
    }

    static async SaveNewUser(name:string, password:string): Promise<any>{
        if (await DataBase.isNameTaken(name)){
            console.log(`名稱 "${name}" 已經存在，無法添加使用者。`);
            const errorMessage = `名稱 "${name}" 已經存在，請更換使用者名稱`;
            return { success: false, message: errorMessage, code:401 };
        }
        try{
            const user = new userModel({
                userName: name,
                userPassword: password,
                booklist:[],
            });
            await user.save();
            return { success: true, message: "SaveNewUser  success" };
        }catch(e:any){
            const errorMessage = `SaveNewUser  fail: ${e.message}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    }

    static async DelUser(name: String) {
        try {
            const result = await userModel.deleteOne({ userName:name });
            if (result.deletedCount === 1) {
                return { success: true, message: "DelUser succeed" };
            } else {
                return { success: false, message: `找不到使用者: ${name}` };
            }
        } catch (e:any) {
            const errorMessage = `DelUser  fail: ${e.message}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    }

    static async AddFav(story_id: string) {
        try {
            const Book = await storyModel.findById(story_id);
            // test用 
            console.log(`Received story_id: ${story_id}`);

            if (Book) {
                Book.is_favorite = true;
                await Book.save();
                console.log(`DB Successfully added book to favorite`);
            } else {
                console.error(`Can not find this book`);
            }
        } catch (e) {
            console.error(`DB Failed added book to favorite`);
        }
    }

    static async RemoveFav(story_id: string){
        try {
            const Book = await storyModel.findById(story_id);
            // test用 console.log(`Received story_id: ${story_id}`);
            if(Book){
                Book.is_favorite = false;
                await Book.save();
                console.log(`Successfully removed book to favorite`);
            }else{
                console.error(`Can not find this book`);
            }
        } catch (e) {
            console.error(`Failed removed book to favorite`);
        }
    }
    
}