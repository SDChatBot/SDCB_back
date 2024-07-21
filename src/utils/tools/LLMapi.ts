import { DataBase } from "../DataBase";
import { RoleFormInterface } from "../../interfaces/RoleFormInterface";
import dotenv from 'dotenv';
dotenv.config();
  
//向 LLM 送一次對話請求
/**
 * @param {string Object} storyInfo 根據不同需求送入不同的對話json 就可以了 
 * @returns 回傳LLM 生成的對話回應
 * @example
 * {
        "message": `對話內容`,
        "mode": "chat"
 * }
 */
export const LLMGenChat = async (storyInfo: Object): Promise<string> => {
    const controller: AbortController = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
        },
        body: JSON.stringify(storyInfo),
        signal: controller.signal,
    };
    try {
        const response = await fetch(process.env.LLM_generate_api!, requestOptions);
        clearTimeout(timeoutId);
        if (response.ok) {
            const story = await response.json();
            return story.response;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error:any) {
        if (error.name === 'AbortError') {
            // throw new Error(`Request timed out after ${15} seconds`);
            console.error(`Request timed out after ${15} seconds`);
            controller.abort();
        }else{
            console.error(`LLMGenChat fail: ${error}`);
            throw error;
        }
        return "";
    }
}

export declare let generated_story_array:string[];

/**
 * 生成完整的故事內容(送了兩次請求，一次生成，一次修改)
 * @param {RoleFormInterface} storyRoleForm 想生成的故事主題表單 
 * @param {Response} Response 回應status code，不回傳其他東西
 * @return {Object<string>} Saved_storyID 剛儲存好故事的唯一id
 */
export const LLMGenStory_1st_2nd = async (storyRoleForm: RoleFormInterface, Response:any) =>{
    let storyInfo = storyRoleForm.description;
    try {
        let payload1: object = {
            "model": "Llama3-TAIDE-LX-8B-Chat-Alpha1.Q5_K_M.gguf:latest", 
            "prompt": `用繁體中文幫我生成一篇500到600字適合小孩子的故事，並大約100字使用{\n}換行。首先，故事內容請根據${storyRoleForm.description}的敘述，產生符合敘述的故事情節。再來是主角:${storyRoleForm.mainCharater}和其他角色們:${storyRoleForm.otherCharacters}，請不要另外增加在${storyRoleForm.mainCharater}和${storyRoleForm.otherCharacters}中無提到的角色名字，並幫所有角色產生出符合故事情境的對話。最後是${storyRoleForm.style}，請根據輸入詞，產生跟輸入詞相關的故事風格。請在故事的最後加入以下這句話:\n希望你也喜歡這個關於${storyRoleForm.style}的故事！如果還有其他問題或需要幫助，請不要猶豫，告訴我吧。謝謝你讀我的故事，下次見喔！。請你以以下格式回答我的問題: {故事內容}。<|eot_id|>`,
            "stream": false
        }
        const story_1st = await LLMGenChat(payload1);
        // console.log(`story_1st success`);
        // 第二次生成
        let payload2 = {
            "model": "Llama3-TAIDE-LX-8B-Chat-Alpha1.Q5_K_M.gguf:latest",
            "prompt": `幫我檢視並修改以下故事，使用生動、活潑、有趣、的口語重新生成一篇全新的故事，僅須回答我修改後的故事內容，不用回覆我其他與故事無關的訊息，包括更改哪些部分或使用了什麼語氣等無用訊息。最後使用繁體中文回應所有答覆。最後這是我要修改的故事: ${story_1st}`,
            "stream": false
        };
        const story_2nd:string = await LLMGenChat(payload2);
        // REMOVE console
        console.log(`story_2nd storyout = ${story_2nd}`);
        // console.log(`story_2nd success`);
        if (story_2nd !== "") {
            generated_story_array = story_2nd.split("\n");
            // console.log(`generated_story_array = ${generated_story_array}`);
            let Saved_storyID = await DataBase.SaveNewStory_returnID(story_2nd, storyInfo);
            return Saved_storyID;
        }
    } catch (error) {
        console.error(`Error in LLMGenStory_1st_2nd: ${error}`);
        throw error;
    }
}