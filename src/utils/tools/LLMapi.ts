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
    const abort_controller = new AbortController(); // 每次調用時創建新的 AbortController
    const timeoutId = setTimeout(() => abort_controller.abort(), 17000);
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
        },
        body: JSON.stringify(storyInfo),
        signal: abort_controller.signal,
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
            console.error(`LLMGenChat Request timed out after 30 seconds, ${error}`);
        } else {
            console.error(`LLMGenChat fail: ${error}`);
        }
        throw error; // 重新拋出錯誤，讓調用者處理
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
            "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest", 
            "prompt": `用繁體中文幫我生成一篇{{400到500字}}適合小孩子的故事，並大約{{80字使用{\n\n}換行}}。首先，故事內容請根據${storyRoleForm.description}的敘述，產生符合敘述的故事情節。再來是主角:${storyRoleForm.mainCharacter}和其他角色們:${storyRoleForm.otherCharacters}，並幫所有角色產生出符合故事情境的對話。最後請根據輸入詞，產生跟輸入詞相關的故事風格。請你以以下格式回答我的問題: {故事內容}。<|eot_id|>`,
            "stream": false,
            "total_duration":14,
            "eval_count": 450,
        }
        const story_1st = await LLMGenChat(payload1);

        // 第二次生成
        let payload2 = {
            "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest",
            "prompt": `幫我檢視並修改以下故事${story_1st}。使用生動、活潑、有趣、的口語重新生成一篇全新的故事，確保故事字數在{{400到500字}}，並大約{{80字使用{\n\n}換行}}。僅須回答我修改後的故事內容，{{不用回覆我其他與故事本身無關的訊息，包括更改哪些部分或使用了什麼語氣等非故事內容的無用訊息}}。最後使用繁體中文回應所有答覆。以下是一個範例故事: 有一位叫喬治的小男孩，他和好朋友朵莉亞總是形影不離，這天，兩位好朋友一起吃午餐。\n\n喬治：哇，這道菜看起來真好吃！\n\n朵莉亞：是啊，媽媽花了好多時間做這頓飯。你吃過那種超酷的智能米嗎？\n\n喬治：有啊，它真的很好吃！我喜歡它會隨著你吃多少量自動調整溫度，這樣就不會浪費食物了。\n\n朵莉亞：沒錯，科技真是進步得太快了。我聽說未來還會有機器人幫忙做家事，那該多好啊！\n\n喬治：我也不，我總是被那些能說話的機器和飛行汽車給吸引。你知道嗎？我前幾天在街上看到一輛全新的超音速汽車，速度簡直快得嚇人！\n\n朵莉亞：哇，那肯定很酷。但我還是喜歡我們現在的生活，慢慢來享受美食和與朋友相處的時光，比快速前進更重要。\n\n喬治：我同意。我們應該好好珍惜這些簡單的事物，因為它們才是真正快樂的源泉。\n\n在公園裡，他們跟其他小孩一起玩耍，分享著各式新穎的玩具和遊戲。雖然生活被科技包圍，但最重要的還是人與人之間的情誼，以及那些難以忘懷的美好回憶。`,
            "stream": false,
            "total_duration":14,
            "eval_count": 450,
        };
        const story_2nd:string = await LLMGenChat(payload2);

        if (story_2nd !== "") {
            generated_story_array = story_2nd.split("\n\n");
            console.log(`generated_story_arrayAA.length = ${generated_story_array.length}`);
            let Saved_storyID = await DataBase.SaveNewStory_returnID(story_2nd, storyInfo);
            return Saved_storyID;
        }else{
            throw new Error('Generated story is empty');
        }
    } catch (error) {
        console.error(`Error in LLMGenStory_1st_2nd: ${error}`);
        throw error;
    }
}

/**
 * 用來刪除Ollama model 占用的記憶體
 */
export const LLMGen_release = async () => {
    try {
        let payload1: object = {
            "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest",
            "prompt": `回答我"好"這一個字就可以了。`,
            "stream": false,
            "keep_alive": 0,
        }
        const release = await LLMGenChat(payload1);
        return 0;
    } catch (error) {
        console.error(`Error in  LLMGen_release: ${error}`);
        throw error;
    }
}