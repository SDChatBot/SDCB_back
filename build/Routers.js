"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const imageRoute_1 = require("./routers/imageRoute");
const promptRoute_1 = require("./routers/promptRoute");
exports.router = [
    new imageRoute_1.ImageRoute(), new promptRoute_1.PromptRoute(),
];
