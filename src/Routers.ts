import { Route } from "./interfaces/Route";
import { ImageRoute } from "./routers/imageRoute";
import { PromptRoute } from "./routers/promptRoute";
import { StoryRoute } from "./routers/StoryRoute";

export const router:Array<Route> = [
    new ImageRoute(), new PromptRoute(), new StoryRoute(),
];