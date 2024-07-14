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

   // http://localhost:7943/story
   protected setRoutes(): void {
      this.router.get(`${this.url}`, this.Controller.test);
      this.router.get(`${this.url}/getstorylist_fdb`, this.Controller.GetStorylistFDB);
      this.router.post(`${this.url}/llm/genstory`, this.Controller.LLMGenStory);
      this.router.post(`${this.url}/llm/genimageprompt`, this.Controller.genimageprompt);

      this.router.post(`${this.url}/image/sdoption`, this.Controller.sdOption);
      this.router.get(`${this.url}/images/sdmodellist`, this.Controller.GetSDModelList);
      this.router.post(`${this.url}/image/re_gen_image`, this.Controller.ReGenImage);
      // http://localhost:7943/story/getstorylist_fdb
      // http://localhost:7943/story/llm/genstory
      // http://localhost:7943/story/llm/genimageprompt
      // http://localhost:7943/story/image/sdoption
      // http://localhost:7943/story/images/sdmodellist
      // http://localhost:7943/story/image/re_gen_image
   }
}