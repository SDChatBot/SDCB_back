"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnswer = exports.AiCreatePicPrompt = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = __importDefault(require("openai"));
const HUGGINGFACE_DEFAULT_STABLE_DIFFUSION_MODEL = "prompthero/openjourney";
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});
//生成圖片的prompt
const AiCreatePicPrompt = (userMsg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'system', content: `Whever I ask you in any language to draw an image, use English to respond with the following JSON: { "model": "${HUGGINGFACE_DEFAULT_STABLE_DIFFUSION_MODEL}", "prompt": string, "negative_prompt": string }, and fill in prompt with very detailed tags used in Stable Diffusion, and fill in negative_prompt with common negative tags used in Stable Diffusion.\nOnly English should be used in prompt and negative_prompt.` },
                { role: 'user', content: `${userMsg}` },
            ],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    }
    catch (e) {
        //console.log(`AiCreatePicPrompt error:${e}`)
        return "none";
    }
});
exports.AiCreatePicPrompt = AiCreatePicPrompt;
//回答使用者
const AiAnswer = (userMsg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。` },
                { role: 'user', content: `${userMsg}` },
            ],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    }
    catch (e) {
        //console.log(`AiAnswer error:${e}`)
        return "none";
    }
});
exports.AiAnswer = AiAnswer;
