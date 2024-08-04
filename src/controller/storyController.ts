import { Controller } from "../interfaces/Controller";
import { Request, Response} from "express";
import { DataBase } from "../utils/DataBase";
import { LLMGenStory_1st_2nd, LLMGen_release } from "../utils/tools/LLMapi";
import { GenImg_prompt_En_array, GenImg_prompt_En, sdModelOption, getSDModelList } from "../utils/tools/LLM_fetch_images";
import { storyInterface } from "../interfaces/storyInterface";
import { fetchImage, getVoices } from "../utils/tools/fetch";
import { RoleFormInterface } from "../interfaces/RoleFormInterface";
import { GenVoice, isObjectValid, delayedExecution } from "../utils/tools/tool";
import { caseSdModelUse } from "../utils/tools/sdModel_tool";
import fs from "fs";
import path from 'path';  



export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    Response.send(`this is STORY get, use post in this url is FINE !`);
  }
  
  // 拿單一本書的資訊並回傳
  public async StartStory(Request:Request, Response:Response){
    const { storyId } = Request.body;
    const story:storyInterface = await DataBase.getStoryById(storyId);
    Response.send(story);
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
    if (!isObjectValid(storyRoleForm)) {
        return Response.send({
            code: 403,
            message: "storyRoleForm 或其中的某個屬性是 null、undefined 或空陣列",
            success: false
        });
    }

    console.log(`storyRoleForm = ${JSON.stringify(storyRoleForm)}`);
    let generated_story_array: string[] | undefined;
    const MODEL_NAME = storyRoleForm.style;
    await sdModelOption(MODEL_NAME);

    let generated_imageprompt_array: string[] = [];
    let Saved_storyID: string = "";

    // 用故事內容生成故事圖片prompt
    const GenImagePrompt = async (generated_story_array: string[], _id: string): Promise<void> => {
        if (generated_story_array) {
            generated_imageprompt_array = await GenImg_prompt_En_array(generated_story_array);
            console.log(`generated_imageprompt_array.length = ${generated_imageprompt_array.length}`);
            await DataBase.Update_StoryImagePrompt(_id, generated_imageprompt_array);
        }
    };

    // 生成圖片
    const GenImage = async (generated_story_image_prompt: Array<string>, _id: string, sd_name:string): Promise<void> => {
      const settingPlayload = caseSdModelUse(sd_name);
      console.log(`settingPlayload = ${JSON.stringify(settingPlayload)}`);
      let promises: Promise<string[]>[] = [];
        for (let i = 0; i < generated_story_image_prompt.length; i++) {
            let payload: Object = {
                "prompt": generated_story_image_prompt[i]+settingPlayload.exclusive_prompt,
                "seed": -1,
                "cfg_scale": 7,
                "steps": 20,
                "enable_hr": false,
                "denoising_strength": 0.75,
                "restore_faces": false,
                "negative_prompt": settingPlayload.negative_prompt + "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, Realism, worst quality, bad quality, poor quality, blurry, zombie, ugly, cropped, out of frame",
            };
            console.log(`GenImage 第${i}次生成`);
            promises.push(fetchImage(payload));

            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        try {
            let generated_imagebase64_array: string[] = (await Promise.all(promises)).flat();
            await DataBase.Update_StoryImage_Base64(_id, generated_imagebase64_array);
        } catch (error: any) {
            console.error(`Error in GenImage: ${error.message}`);
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
            generated_story_array = story.storyTale.split("\n\n");

            await delayedExecution();

            console.log(`start GenImagePrompt\n`);
            await GenImagePrompt(generated_story_array || [], Saved_storyID);
            await LLMGen_release(); // 清除Ollama model 占用記憶體

            // Fetch the updated story data to get the generated image prompts
            const updatedStory: storyInterface = await DataBase.getStoryById(Saved_storyID);
            const generated_story_image_prompt = updatedStory.image_prompt;

            if (!generated_story_image_prompt || generated_story_image_prompt.length === 0) {
                throw new Error('No image prompts generated，圖片提示生成失敗');
            }
            console.log(`start GenImage`);
            await GenImage(generated_story_image_prompt, Saved_storyID, storyRoleForm.style);

            console.log(`start getVoices`);
            const joinedStory = generated_story_array.join(", ");
            await GenVoice(Saved_storyID, joinedStory);
            console.log(`story generate finish !!`);

        } catch (error: any) {
            console.error(`Error generating story: ${error.message}`);
            throw error;
        }
    };

    try {
        await generateStory(storyRoleForm);
        // 所有異步操作完成後，回傳成功的狀態碼
        let return_playload = {
            success: true,
            storyId: Saved_storyID
        };
        return Response.status(200).send(return_playload);
    } catch (error:any) {
      console.error(`Error in generateStory: ${error.message}`);
      return Response.status(500).send({
          success: false,
          message: 'generateStory Error: ' + error.message
      });
    }
  }


  public async genimageprompt(Request:Request, Response:Response){
    const story_slice = Request.body.story_slice!;
    const res= await GenImg_prompt_En(story_slice);
    Response.send(`res = ${res}`);
  }

  public async sdOption(Request:Request, Response:Response){
    let MODEL_NAME:string = Request.body.modelname || "fantasyWorld_v10.safetensors";
    Response.send(await sdModelOption(MODEL_NAME));
  }

  public async GetSDModelList(Request:Request, Response:Response){
    Response.send(await getSDModelList());
  }

  public ReGenImage = async (Request: Request, Response: Response) => {
    console.log(`here`);
    let { prompt } = Request.body;
    let payload: Object = {
      "prompt": prompt,
      "seed": -1,
      "cfg_scale": 7,
      "steps": 20,
      "enable_hr": false,
      "denoising_strength": 0.75,
      "restore_faces": false,
    };

    try {
      let images = await fetchImage(payload);
      Response.json({ images });
    } catch (error) {
      Response.status(500).send({ error: "Failed to generate image" });
    }
  };

  public async SaveVoice(req: Request, res: Response) {
    try {
      const { storyId, storyTale } = req.body;
      const { audioFileName, audioBuffer } = await getVoices(storyId, storyTale);

      const filePath = path.join(process.env.dev_saveAudio!, audioFileName);
      await fs.promises.writeFile(filePath, Buffer.from(audioBuffer));

      res.json({
        success: true,
        message: "Voice generated successfully",
        audioFilePath: filePath,
        audioFileName: audioFileName
      });

    } catch (error) {
      console.error("Error in voice generation test:", error);

      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json({
        success: false,
        message: "Voice generation test failed",
        error: errorMessage
      });
    }
  }

  public async TakeVoice(Request: Request, Response: Response) {
    try {
      const { storyId } = Request.body;

      if (!storyId) {
        return Response.status(400).send('storyId is required');
      }

      const filePath = path.resolve(process.env.dev_saveAudio!, `Saved_${storyId}.wav`);
      // console.log(`filePath = ${filePath}`);

      if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return Response.status(404).send('File not found');
      }

      const stat = fs.statSync(filePath);
      Response.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename=Saved_${storyId}.wav`
      });

      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        console.error('Error reading file:', error);
        Response.status(500).end('Error reading file');
      });

      fileStream.pipe(Response);

      fileStream.on('end', () => {
        console.log('File sent successfully');
        Response.end();
      });

    } catch (error) {
      console.error('Error processing request:', error);
      Response.status(500).send('Internal Server Error');
    }
  }
}