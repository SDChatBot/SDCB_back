import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export const AiAnswer = async (userMsg:string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `${userMsg}` }],
            model: 'gpt-3.5-turbo',
        });
        //console.log(JSON.stringify(completion));
        //console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (e) {
        console.log(`AiAnswer error:${e}`)
        return "none";
    }
} 
