"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const imageRoute_1 = require("./routers/imageRoute");
const Model3DRoute_1 = require("./routers/Model3DRoute");
const promptRoute_1 = require("./routers/promptRoute");
const StoryRoute_1 = require("./routers/StoryRoute");
exports.router = [
    new imageRoute_1.ImageRoute(), new promptRoute_1.PromptRoute(), new StoryRoute_1.StoryRoute(), new Model3DRoute_1.Model3DRoute(),
];
