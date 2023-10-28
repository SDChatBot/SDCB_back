import { StoryController } from "../controller/storyController";
import { Route } from "../interfaces/Route";

export class StoryRoute extends Route{
   protected url: string = '';
   protected Controller = new StoryController;
   constructor(){
      super()
      this.url = '';
      this.setRoutes();
   }

   //http://localhost:7943/story
   protected setRoutes(): void {
      this.router.get(`${this.url}/story`, this.Controller.test);
      this.router.get(`${this.url}/getstoryfdb`, this.Controller.GeyStoryFDB);
      this.router.post(`${this.url}/getstoryfdb`, this.Controller.GeyStoryFDB);
      this.router.post(`${this.url}/story`,this.Controller.GenerStory);
      // this.router.post(`${this.url}/sleep`, this.Controller.SleepStory);

   }
}