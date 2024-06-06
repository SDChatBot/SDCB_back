import { Controller } from "../interfaces/Controller";
import { Request, Response} from "express";
import { DataBase } from "../utils/DataBase";
import { books } from "../interfaces/books";
import { LLMGenStory_1st_2nd } from "../utils/tools/LLMapi";
import { GenImg_prompt_En_array } from "../utils/tools/images/LLM_fetch_images";


export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    Response.send(`this is STORY get, use post in this url is FINE !`);
  }

  //拿資料庫故事
  public GeyStoryFDB(Request: Request, Response: Response) {
    let data = Request.query.id;
    DataBase.getStoryById(data as string).then((storytail) => {
      // console.log(`storytail = ${storytail}`)
      Response.send(storytail)
    })
  }

  //拿最新創建的故事id
  public GetNewestStoryID(Request: Request, Response: Response) {
    DataBase.getNewestId().then((newestId: string) => {
      Response.send(newestId);
    }).catch((e) => {
      console.log(` GetNewestStoryID fail :${e}`);
    })
  }

  //拿整理好的books (storyId: string; storyName: string;)
  public GetBooks(Request: Request, Response: Response) {
    DataBase.getBooks().then((books: books[]) => {
      Response.send(JSON.stringify(books));
    })
  }

  


  public async LLMGenStory(Request: Request, Response: Response) {
    let storyInfo: string = Request.body.storyInfo;
    let generated_story_array: string[] | undefined;

    async function delayedExecution(): Promise<void> {
      console.log('Waiting for 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 5 秒鐘
      console.log('3 seconds have passed. Executing the next code...');
    }

    const GenImagePrompt = async (generated_story_array: string[]): Promise<void> => {
      if (generated_story_array) {
        await GenImg_prompt_En_array(generated_story_array, Response);
      }
    };

    const generateStory = async (storyInfo: string): Promise<void> => {
      generated_story_array = await LLMGenStory_1st_2nd(storyInfo, Response);
      delayedExecution();
      await GenImagePrompt(generated_story_array || []);
    };


    const promises = [
      generateStory(storyInfo),
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



}