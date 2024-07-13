import { Controller } from "../interfaces/Controller";
import { Request, Response} from "express";
import { DataBase } from "../utils/DataBase";
import { LLMGenStory_1st_2nd } from "../utils/tools/LLMapi";
import { GenImg_prompt_En_array, GenImg_prompt_En } from "../utils/tools/images/LLM_fetch_images";
import { storyInterface } from "../interfaces/storyInterface";
import { fetchImage, sdModelOption, getSDModelList } from "../utils/tools/fetch";
import { RoleFormInterface } from "../interfaces/RoleFormInterface";
import { GenVoice } from "../utils/tools/voices";



export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    Response.send(`this is STORY get, use post in this url is FINE !`);
  }

  //拿資料庫故事
  public GetStorylistFDB(Request: Request, Response: Response) {
    let { userId } = Request.query;
    console.log(`userId = ${userId}`);
    DataBase.getstoryList(userId as string).then((result) => {
      if (result.success){
        return Response.status(200).send(result.message);
      }else{
        return Response.status(403).send(result.message);
      }
    }).catch((e:any)=>{
      console.error(`GetStorylistFDB fail: ${e.message}`);
      return Response.status(400).send('GetStorylistFDB fail');
    });
  }

  /**
   * 
   * @param Request storyInfo 你的故事是甚麼內容
   * @example http://localhost:7943/story/llm/genstory post
   * {
   *   "roleform":{"style":"帥貓咪","mainCharacter":"","description":"","otherCharacters":[]}
   * }
   */
  public async LLMGenStory(Request: Request, Response: Response) {
    let storyRoleForm: RoleFormInterface = Request.body.roleform;
    console.log(`storyRoleForm = ${JSON.stringify(storyRoleForm)}`);
    let generated_story_array: string[] | undefined;

    async function delayedExecution(): Promise<void> {
      console.log('Waiting for 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 5 秒鐘
    }

    let generated_imageprompt_array: string[] = [];
    let Saved_storyID: string = "";

    // 用故事內容生成故事圖片prompt
    const GenImagePrompt = async (generated_story_array: string[], _id:string): Promise<void> => {
      if (generated_story_array) {
        generated_imageprompt_array = await GenImg_prompt_En_array(generated_story_array);
        await DataBase.Update_StoryImagePrompt(_id, generated_imageprompt_array);
      }
    };

    const GenImage = async (generated_story_image_prompt: Array<string>, _id: string): Promise<void> => {
      let promises: Promise<string>[] = [];

      // 遍历生成的图片提示词数组
      for (let i = 0; i < generated_story_image_prompt.length; i++) {
        let payload: Object = {
          "prompt": generated_story_image_prompt[i],
          "seed": -1,
          "cfg_scale": 7,
          "step": 2,
          "enable_hr": false,
          "denoising_strength": 100,
          "restore_faces": false,
        };

        let fetchImagePromise = (): Promise<string> => {
          return new Promise((resolve, reject) => {
            fetchImage(payload).then((image_base64: string) => {
              resolve(image_base64); 
            }).catch((error: any) => {
              reject(error);
            });
          });
        };

        promises.push(fetchImagePromise());

        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      try {
        let generated_imagebase64_array: string[] = await Promise.all(promises);
        await DataBase.Update_StoryImage_Base64(_id, generated_imagebase64_array);
      } catch (error:any) {
        console.error(`Error in GenImage: ${error.message}`);
        throw Error;
      }
    };


    // 生成故事內容
    const generateStory = async (storyRoleForm: RoleFormInterface): Promise<void> => {
      try {
        Saved_storyID = await LLMGenStory_1st_2nd(storyRoleForm, Response);
          if (!Saved_storyID) {
            throw new Error('Failed to generate story ID，生成故事失敗');
          }
          console.log(`Saved_storyID = ${Saved_storyID}`);
          const story: storyInterface = await DataBase.getStoryById(Saved_storyID);
          generated_story_array = story.storyTale.split("\n");
          delayedExecution();
          // 生成故事圖片提示詞
          console.log(`start GenImagePrompt`);
          await GenImagePrompt(generated_story_array || [], Saved_storyID);
          const generated_story_image_prompt = story.image_prompt;
          console.log(`start GenImage`);
          await GenImage(generated_story_image_prompt!, Saved_storyID)

          console.log(`start GenVoice`);
          await GenVoice(generated_story_array, Saved_storyID);

      } catch (error:any) {
        console.error(`Error generating story: ${error.message}`);
        throw error;
      }
    };


    const promises = [
      generateStory(storyRoleForm),
    ];

    try {
      await Promise.all(promises);
      // 所有異步操作完成後，回傳成功的狀態碼
      return Response.status(200).send('All operations have been completed successfully');
    } catch (error) {
      console.error(`Error in LLMGenStory: ${error}`);
      return Response.status(500).send('Internal Server Error');
    }
  }

  public async genimageprompt(Request:Request, Response:Response){
    const story_slice = Request.body.story_slice!;
    const res= await GenImg_prompt_En(story_slice);
    Response.send(`res = ${res}`);
  }

  public async sdOption(Request:Request, Response:Response){
    // let MODEL_NAME = `AnythingXL_xl.safetensors [8421598e93]`
    let MODEL_NAME:string = Request.body.modelname!;
    Response.send(await sdModelOption(MODEL_NAME));
  }

  public async GetSDModelList(Request:Request, Response:Response){
    Response.send(await getSDModelList());
  }

}