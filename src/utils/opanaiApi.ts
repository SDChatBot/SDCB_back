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

//回答使用者
export const AiAnswer = async (userMsg: string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'assistant', content: `你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。` },
                { role: 'user', content: `${userMsg}` },],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (e) {
        //console.log(`AiAnswer error:${e}`)
        return "none";
    }
} 
