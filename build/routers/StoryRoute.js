"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryRoute = void 0;
const storyController_1 = require("../controller/storyController");
const Route_1 = require("../interfaces/Route");
class StoryRoute extends Route_1.Route {
    constructor() {
        super();
        this.url = '';
        this.Controller = new storyController_1.StoryController;
        this.url = '/story';
        this.setRoutes();
    }
    //http://localhost:7943/story/...
    setRoutes() {
        this.router.get(`${this.url}`, this.Controller.test);
        this.router.post(`${this.url}`, this.Controller.GenerStory);
        this.router.get(`${this.url}/newstoryid`, this.Controller.GetNewestStoryID);
        this.router.get(`${this.url}/getbooks`, this.Controller.GetBooks);
        this.router.get(`${this.url}/getstoryfdb`, this.Controller.GeyStoryFDB);
        // this.router.post(`${this.url}/sleep`, this.Controller.SleepStory);
        this.router.post(`${this.url}/llm/genstory`, this.Controller.llmgenStory);
        //http://localhost:7943/story/llm/genstory
    }
}
exports.StoryRoute = StoryRoute;
