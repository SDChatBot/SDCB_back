import dotenv from 'dotenv';
dotenv.config();
//import { ChatGPTAPI } from 'chatgpt';
//const ChatGPTAPI = require('chatgpt');
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export const AiAnswer = async()=>{
    try{
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: '可以告訴我1+1等於幾嗎' }],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content
        //return completion;
    }catch{
        console.log(``)
        //return ""
    }

} 