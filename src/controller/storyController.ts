import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiStory } from "../utils/opanaiApi";

export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    Response.send(`this is STORY get, use post in this url is FINE !`);
  }
  public GenerStory(Request: Request, Response: Response) {
    let infoVal = Request.body;
    // console.log(infoVal)
    AiStory(infoVal).then((story:string | null)=>{
      Response.send({tailStory: story});
    })
  }
}