import { StoryController } from "../controller/storyController";
import { Route } from "../interfaces/Route";

export class StoryRoute extends Route{
   protected url: string = '';
   protected Controller = new StoryController;
   constructor(){
      super()
      this.url = '/story';
      this.setRoutes();
   }

   //http://localhost:7943/story/...
   protected setRoutes(): void {
      this.router.get(`${this.url}`, this.Controller.test);
      this.router.post(`${this.url}`,this.Controller.GenerStory);
      this.router.get(`${this.url}/newstoryid`, this.Controller.GetNewestStoryID);
      this.router.get(`${this.url}/getbooks`, this.Controller.GetBooks);
      this.router.post(`${this.url}/getstoryfdb`, this.Controller.GeyStoryFDB);
      // this.router.post(`${this.url}/sleep`, this.Controller.SleepStory);
   }
}