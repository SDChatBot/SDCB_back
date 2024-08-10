import { Route } from "./interfaces/Route";
// import { Model3DRoute } from "./routers/Model3DRoute";
// import { PromptRoute } from "./routers/promptRoute";
import { StoryRoute } from "./routers/StoryRoute";
import { UserRoute } from "./routers/userRoute";
import {VoiceRoute} from "./routers/VoiceRoute";

export const router:Array<Route> = [
    new StoryRoute(), new UserRoute, new VoiceRoute(),
];