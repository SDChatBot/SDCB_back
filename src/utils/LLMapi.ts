import { DataBase } from "../utils/DataBase";
import dotenv from 'dotenv';
dotenv.config();
  
//向 LLM 送一次對話請求
/**
 * 
 * @param {string Object} storyInfo 根據不同需求送入不同的對話json 就可以了 
 * @returns 回傳LLM 生成的對話回應
 * @example
 * {
        "message": `對話內容`,
        "mode": "chat"
 * }
 */
const LLMGenChat = async (storyInfo: Object): Promise<string> => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
        },
        body: JSON.stringify(storyInfo),
    };
    try {
        const response = await fetch(process.env.LLM_generate_api!, requestOptions);
        if (response.ok) {
            const story = await response.json();
            return story.textResponse;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error) {
        console.error(`LLMGenChat fail: ${error}`);
        throw error;
    }
}

/**
 * 生成完整的故事內容(送了兩次請求，一次生成，一次修改)
 * @param {string} storyInfo 想生成的故事主題 
 * @param {Response} Response 回應status code，不回傳其他東西
 */
export const LLMGenStory_1st_2nd = async (storyInfo:string, Response:any) =>{
    try {
        // 第一次生成
        let payload1:object = {
            "message": `用繁體中文幫我生成一篇關於${storyInfo}的適合小孩子的故事，請你以以下格式回答我的問題: {故事內容}`,
            "mode": "chat"
        };
        const story_1st = await LLMGenChat(payload1);
        console.log(`story_1st success`);
        // 第二次生成
        let payload2 = {
            "message": `幫我檢視並修改以下故事，使用生動、活潑、有趣、的口語重新描述一遍故事，並確保他是適合小朋友的故事，使用繁體中文回應所有答覆。以下是我要修改的故事: ${story_1st}`,
            "mode": "chat"
        };
        const story_2nd:string = await LLMGenChat(payload2);
        console.log(`story_2nd success`);
        if (story_2nd !== "") {
            // Response.send(`{ "storyPrompt": ${story_2nd} }`);
            DataBase.SaveNewStory(storyInfo, story_2nd, Response);
        }
    } catch (error) {
        console.error(`Error in LLMGenStory_1st_2nd: ${error}`);
        Response.status(500).send('Internal Server Error');
    }
}