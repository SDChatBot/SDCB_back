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
exports.AiSleep = exports.ImproveStory = exports.AiStory = exports.AiStoryStudy = exports.AiAnswer = exports.AiCreatePicPrompt = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});
//生成圖片的英文 prompt
const AiCreatePicPrompt = (userMsg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            //把它回傳的物件樣是設定為: {prompt: .....} 的指令為: The returned format is {prompt: }
            messages: [
                { role: 'system', content: `Whever I ask you in any language to draw an image, use English to respond.Only the english picture prmpt needs to be returned, and no redundant information needs to be returned. ` },
                { role: 'user', content: `Generate an English description about the generated image of ${userMsg}. Just generate the image prompt for the description within {}, and there is no need to generate other redundant prompts.` },
            ],
            model: 'gpt-3.5-turbo',
        });
        // console.log(JSON.stringify(completion));
        // console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    }
    catch (e) {
        console.log(`AiCreatePicPrompt error:${e}`);
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
//ai故事生成(學習用)
const AiStoryStudy = (infoVal) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(`infoval = ${JSON.stringify(infoVal)}`)
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `是一位很有想法的故事作家，請幫我生成大約100字寫一篇重生文，並根據劇情進行分段` },
                { role: 'user', content: `幫我生成一篇文章其內容關於:${infoVal.eduStageInfo}${infoVal.eduClassInfo}、加減乘除的奇幻小說故事。請幫我在故事中安差關於加減乘除的知識，如果可以，在想出一個需要用到排列組合的情境題` },
            ],
            model: 'gpt-3.5-turbo',
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
exports.AiStoryStudy = AiStoryStudy;
//正式使用版本(生故事)
const AiStory = (storyObject) => __awaiter(void 0, void 0, void 0, function* () {
    const timeout = 80000;
    //const start = performance.now();
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'system', content: "你是一位兒童繪本專家，你的工作就是說出指定主題的故事，目標受眾是三至五歲的兒童" },
                { role: 'assistant', content: "故事字數必須在80字以下，允許20字誤差，其他多餘的話請全部省略，故事要是兒童能輕易理解的，不要有過多不必要的修飾詞，故事內容中的中文字請用繁體中文，故事要盡可能符合現實常理，只要說出故事就好，不要有結語" },
                { role: 'user', content: `${storyObject.storyInfo}` },
            ],
            model: 'gpt-3.5-turbo',
        });
        const completionTimeCheck = yield Promise.race([
            completion,
            new Promise((_, reject) => setTimeout(() => reject(new Error('AiStory timeout')), timeout))
        ]);
        // const end = performance.now();
        // console.log(`AiStory took ${end - start} milliseconds to complete`);
        try {
            (0, exports.ImproveStory)(completionTimeCheck.choices[0].message.content).then((fixedStory) => {
                return fixedStory;
            }).catch((e) => {
                console.log(` ImproveStory success : ${e}`);
                return "none";
            });
        }
        catch (e) {
            console.log(`ImproveStory fail : ${e}`);
            return "none";
        }
        return completionTimeCheck.choices[0].message.content || "";
    }
    catch (e) {
        console.log(`AiStory error:${e}`);
        return "none";
    }
});
exports.AiStory = AiStory;
//  修正故事
const ImproveStory = (story) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'system', content: "你的任務是把以下的故事變的順暢且更易於理解，同時去除多餘的字詞，並且加深感情，最後用兒童繪本的分段方式進行分段，每敘述完一張圖片就進行換行" },
                { role: 'user', content: `${story}` },
                { role: 'assistant', content: `嚴厲禁止加長故事篇幅，另外請在分段處加上\n\n` },
            ],
            model: 'gpt-3.5-turbo',
        });
        return completion.choices[0].message.content || "";
    }
    catch (e) {
        console.log(`getStory Error: ${e}`);
        return "none";
    }
});
exports.ImproveStory = ImproveStory;
// 睡前故事
const AiSleep = (storyTheme) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `你現在的角色是一位是一位父母，而我是你的小孩，請跟我講一個生動、從來沒有人說過的睡前故事，要大約800~1000字` },
                { role: 'user', content: `請跟我講一個關於"${storyTheme}" 的故事` },
            ],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    }
    catch (e) {
        //console.log(`AiSleep error:${e}`)
        return "none";
    }
});
exports.AiSleep = AiSleep;
