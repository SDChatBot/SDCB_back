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
exports.AiStory = exports.AiAnswer = exports.AiCreatePicPrompt = void 0;
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
// //回答使用者
// export const AiAnswer = async (userMsg: string) => {
//     try {
//         const completion = await openai.chat.completions.create({
//             messages: [
//                 { role: 'assistant', content: `你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。` },
//                 { role: 'user', content: `${userMsg}` },],
//             model: 'gpt-3.5-turbo',
//         });
//         //console.log(JSON.stringify(completion));
//         //console.log(completion.choices[0].message.content);
//         return completion.choices[0].message.content;
//     } catch (e) {
//         //console.log(`AiAnswer error:${e}`)
//         return "none";
//     }
// } 
// let info = {
//     eduStage: '國小',
//     eduClass: '數學',
// }
//用ai 回答學生的問題
const AiAnswer = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(`issue = ${issue}`)
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'system', content: `你是一位教師，請使用蘇格拉底對話來引導學生所提出的問題，不要直接回答學生的問題。` },
                { role: 'assistant', content: `請使用第一人稱為"教師" 來回答問題` },
                // { role: 'assistant', content: `你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。` },
                { role: 'user', content: `${issue}` },
            ],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    }
    catch (e) {
        console.log(`AiAnswer error:${e}`);
        return " ";
    }
});
exports.AiAnswer = AiAnswer;
//ai故事生成
const AiStory = (infoVal) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(`infoval = ${JSON.stringify(infoVal)}`)
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `是一位很有想法的故事作家，請幫我生成大約100字寫一篇重生文` },
                { role: 'user', content: `幫我生成一篇文章其內容關於:${infoVal.eduStageInfo}${infoVal.eduClassInfo}、加減乘除的奇幻小說故事。請幫我在故事中安差關於加減乘除的知識，如果可以，在想出一個需要用到排列組合的情境題` },
            ],
            model: 'gpt-4',
        });
        //console.log('Story Generated')
        //console.log(JSON.stringify(completion));
        return completion.choices[0].message.content;
    }
    catch (e) {
        console.log(`AiStory error:${e}`);
        return "none";
    }
});
exports.AiStory = AiStory;
