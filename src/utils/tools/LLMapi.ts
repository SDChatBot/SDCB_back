import { DataBase } from "../DataBase";
import { RoleFormInterface } from "../../interfaces/RoleFormInterface";
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
            "prompt": `用繁體中文幫我生成一篇關於${storyRoleForm}的400到500字適合小孩子的故事，並大約100字使用{\n}換行，以下是一個簡單的故事範例:\n在燈火闌珊的元宵節夜晚，皮皮和好朋友焦焦、樂樂、慕慕聚在一起，他們興奮地聊著天，分享各自的趣事。\n皮皮說：「我在公園看見許多人放煙火，覺得很漂亮。」\n焦焦則開心地告訴大家：「我幫媽媽做了元宵，覺得超有成就感！」\n樂樂笑著說：「我和同學們一起搓了好多元宵，在學校舉辦的元宵節派對玩得不亦樂乎！」\n慕慕則分享：「我跟爸媽去廟裡拜拜，看見許多人祈求平安，覺得很溫馨。」\n大家談到元宵時，皮皮提到：「我最愛吃甜的元宵，有紅豆、芝麻和花生餡。」\n焦焦則表示：「我還沒機會吃過，要等下次才試得到。」\n於是，他們開始討論各式各樣的元宵口味，有人喜歡鹹的，也有人愛吃甜的。在聊天中，大家還互相分享了家鄉的元宵故事和傳統。\n夜晚漸深，皮皮提議：「我們去附近走走，看有沒有好玩的事。」\n於是，他們在月光下散步，談笑風生。\n途中，他們看到一座美麗的花燈展，大家都驚嘆不已。皮皮最喜歡那隻可愛的小兔子花燈，焦焦則指著自己的生日星座花燈興奮地說：「看，那是我的生日星座花燈！」\n在花燈展前，他們還遇到一個賣著各式小吃的攤位。皮皮迫不及待拿了幾顆糖果吃，其他朋友也紛紛選購他們喜歡的小吃。\n最後，在夜色漸濃時，皮皮和好朋友們回家，都感到非常滿足，因為度過了一個開心的元宵節。\n希望你也喜歡這個關於元宵節夜晚的故事！如果還有其他問題或需要幫助，請不要猶豫，告訴我吧。謝謝你讀我的故事，下次見喔！。請你以以下格式回答我的問題: {故事內容}。<|eot_id|>`,
            "stream": false
        }
        const story_1st = await LLMGenChat(payload1);
        // console.log(`story_1st success`);
        // 第二次生成
        let payload2 = {
            "model": "Llama3-TAIDE-LX-8B-Chat-Alpha1.Q5_K_M.gguf:latest",
            "prompt": `幫我檢視並修改以下故事，使用生動、活潑、有趣、的口語重新生成一篇全新的故事，故事描述如下:故事背景設定在元宵節，主要角色是皮皮。皮皮是一個喜歡交朋友的小孩，他的朋友包括焦焦、樂樂和慕慕。這個故事描述了皮皮和他的朋友們在元宵節一起聊天和搓元宵的快樂時光。皮皮和朋友們在燈火輝煌的夜晚聚集在一起，分享彼此的故事和笑聲。這個故事應該充滿節日氣氛，展現友誼和家庭的溫馨。並確保故事是600到700字適合小孩子的故事，並大約100字使用"\n"換行，僅須回答我修改後的故事內容，不用回覆我其他與故事無關的訊息，包括修改故事哪些部分等無用訊息。最後使用繁體中文回應所有答覆。最後這是我要修改的故事: ${story_1st}`,
            "stream": false
        };
        const story_2nd:string = await LLMGenChat(payload2);
        // REMOVE console
        // console.log(`story_2nd storyout = ${story_2nd}`);
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