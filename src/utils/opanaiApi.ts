import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const HUGGINGFACE_DEFAULT_STABLE_DIFFUSION_MODEL = "prompthero/openjourney";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

//生成圖片的prompt
export const AiCreatePicPrompt = async (userMsg:string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: `Whever I ask you in any language to draw an image, use English to respond with the following JSON: { "model": "${HUGGINGFACE_DEFAULT_STABLE_DIFFUSION_MODEL}", "prompt": string, "negative_prompt": string }, and fill in prompt with very detailed tags used in Stable Diffusion, and fill in negative_prompt with common negative tags used in Stable Diffusion.\nOnly English should be used in prompt and negative_prompt.` },
                { role: 'user', content: `${userMsg}`},],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (e) {
        //console.log(`AiCreatePicPrompt error:${e}`)
        return "none";
    }
} 


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
export const AiAnswer = async (issue:string) => {
    //console.log(`issue = ${issue}`)
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: `你是一位教師，請使用蘇格拉底對話來引導學生所提出的問題，不要直接回答學生的問題。` },
                { role: 'assistant', content: `請使用第一人稱為"教師" 來回答問題`},
                // { role: 'assistant', content: `你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。` },
                { role: 'user', content: `${issue}` },],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (e) {
        console.log(`AiAnswer error:${e}`)
        return " ";
    }
} 

interface infoValInterface{
    eduStageInfo: String,
    eduClassInfo: String,
}

//ai故事生成
export const AiStory = async (infoVal: infoValInterface) => {
    //console.log(`infoval = ${JSON.stringify(infoVal)}`)
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `是一位很有想法的故事作家，請幫我生成大約100字寫一篇重生文，並根據劇情進行分段`},
                { role: 'user', content: `幫我生成一篇文章其內容關於:${ infoVal.eduStageInfo }${ infoVal.eduClassInfo }、加減乘除的奇幻小說故事。請幫我在故事中安差關於加減乘除的知識，如果可以，在想出一個需要用到排列組合的情境題` },],
            model: 'gpt-4',
        });
        //console.log('Story Generated')
        //console.log(JSON.stringify(completion));
        return completion.choices[0].message.content;
    } catch (e) {
        console.log(`AiStory error:${e}`)
        return "none";
    }
} 

// 
export const AiSleep = async (storyTheme: string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `你現在的角色是一位是一位父母，而我是你的小孩，請跟我講一個生動、從來沒有人說過的睡前故事，要大約800~1000字` },
                { role: 'user', content: `請跟我講一個關於"${storyTheme}" 的故事` },],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (e) {
        //console.log(`AiSleep error:${e}`)
        return "none";
    }
}
