import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiStory } from "../utils/opanaiApi";

export class StoryController extends Controller {
  public test(Request: Request, Response: Response) {
    Response.send(`this is STORY get, use post in this url is FINE !`);
  }
  public GenerStory(Request: Request, Response: Response) {
    const userPrompt: string = Request.body.prompt || `a banana`;
    const funcPrompt: string = `${userPrompt}`;
    AiStory(funcPrompt).then((story:string | null)=>{
      Response.send({tailStory: story});
    })
  }
}