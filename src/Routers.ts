import { Route } from "./interfaces/Route";
import { ImageRoute } from "./routers/imageRoute";
import { Model3DRoute } from "./routers/Model3DRoute";
import { PromptRoute } from "./routers/promptRoute";
import { StoryRoute } from "./routers/StoryRoute";

export const router:Array<Route> = [
    new ImageRoute(), new PromptRoute(), new StoryRoute(), new Model3DRoute(), 
];