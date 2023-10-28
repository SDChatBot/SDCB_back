import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiStory, AiSleep } from "../utils/opanaiApi";
import { DataBase } from "../utils/DataBase";

export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    //Response.send(`this is STORY get, use post in this url is FINE !`);
    DataBase.getStoryById("653b89626620dbe005b01bc6").then((storytail)=>{
      Response.send(storytail)
    })
  }


  public GenerStory(Request: Request, Response: Response) {
    let infoVal = Request.body;
    let storyInfo = Request.body.storyInfo;
    console.log(`Request.body.storyInfo = ${Request.body.storyInfo}`)
    // console.log(`infoVal= ${JSON.stringify(infoVal)}`)
    //生成故事
    AiStory(infoVal).then((storyTale: string) => {
      DataBase.SaveNewStory(storyTale, storyInfo)
      Response.send(`story gener ans save success`);
    })
  }
  
  // public SleepStory(Request: Request, Response: Response) {
  //   let theme = Request.body;
  //   // console.log(infoVal)
  //   AiSleep(theme).then((story: string | null) => {
  //     Response.send({ tailStory: story });
  //   })
  // }

  //拿資料庫故事
  public GeyStoryFDB(Request: Request, Response: Response) {
    let data = Request.query.id;
    DataBase.getStoryById(data as string).then((storytail) => {
      // console.log(`storytail = ${storytail}`)
      Response.send(storytail)
    })
  }

}