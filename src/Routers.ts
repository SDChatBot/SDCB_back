import { Route } from "./interfaces/Route";
import { ImageRoute } from "./routers/imageRoute";
// import { Model3DRoute } from "./routers/Model3DRoute";
// import { PromptRoute } from "./routers/promptRoute";
import { StoryRoute } from "./routers/StoryRoute";
import { UserRoute } from "./routers/userRoute";

export const router:Array<Route> = [
    new ImageRoute(), new StoryRoute(), new UserRoute,
];