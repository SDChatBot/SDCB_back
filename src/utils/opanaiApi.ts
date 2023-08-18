import dotenv from 'dotenv';
dotenv.config();
import { ChatGPTAPI } from 'chatgpt'
//const ChatGPTAPI = require('chatgpt');

const api: any = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY || ""
})

export const AiAnswer = async()=>{
    try{
        const res = await api.sendMessage(`Hello World`)
        console.log(`AI 的回答是: ${res.text}`)
        return res.text;
    }catch{
        console.log(``)
        return ""
    }

} 