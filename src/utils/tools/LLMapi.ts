import { DataBase } from "../DataBase";
import { RoleFormInterface } from "../../interfaces/RoleFormInterface";
import { spawn } from "child_process";

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
export const abort_controller: AbortController = new AbortController();

export const LLMGenChat = async (storyInfo: Object): Promise<string> => {
    const abort_controller = new AbortController(); // 每次調用時創建新的 AbortController
    const timeoutId = setTimeout(() => abort_controller.abort(), 30000);
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
            await kill_ollama();
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
            "prompt": `用繁體中文幫我生成一篇{{700字}}適合小孩子的故事，並每{{80字使用{\n\n}換行}}，你回應的故事字數總共800字上下，一頁80字，共10段文字，也就是5頁的故事書，{{請確保故事總共不能超過12個段落}}。首先，故事內容請根據${storyRoleForm.description}的敘述，產生符合敘述的故事情節。再來是主角:${storyRoleForm.mainCharacter}和其他角色們:${storyRoleForm.otherCharacters}，並幫所有角色產生出符合故事情境的對話。請你直接回答故事的內容就好，{{不要出現任何非故事內容相關的文字敘述}}，{{不要出現任何非故事內容相關的文字敘述}}。<|eot_id|>`,
            "stream": false,
            "options":{
                "num_predict":850
            },
        }
        const story_1st = await LLMGenChat(payload1);

        // 第二次生成
        let payload2 = {
            "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest",
            // "model": "Whispertales_model_v4.gguf:latest",
            "prompt": `幫我檢視並修改以下故事${story_1st}。使用生動、活潑、有趣、的口語重新生成一篇全新的故事，確保故事字數在{{700字}}內，並大約{{80字使用{\n\n}換行}}你回應的故事字數總共800字上下，一頁80字，共10段文字，{{請確保故事總共不能超過12個段落}}，{{請確保故事總共不能超過12個段落}}，{{請確保故事總共不能超過12個段落}}。僅須回答我修改後的故事內容，{{不用回覆我其他與故事本身無關的訊息，包括更改哪些部分或使用了什麼語氣等非故事內容的無用訊息}}。最後使用繁體中文回應所有答覆。<|eot_id|>`,
            "stream": false,
            "options":{
                "num_predict":850
            },
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

export const kill_ollama = async () => {
    return new Promise((resolve, reject) => {
      const processDo = spawn('sudo', ['-S', 'pkill', 'ollama'], { stdio: ['pipe', 'pipe', 'pipe'] });
  
      processDo.stdin.write(process.env.systemPassword + '\n');
      processDo.stdin.end();
  
      let stdoutData = '';
      let stderrData = '';
  
      processDo.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
  
      processDo.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
  
      processDo.on('close', (code) => {
        if (code === 0) {
          console.log('pkill ollama');
          resolve({ stdout: stdoutData, stderr: stderrData });
        } else {
          console.error(`fail to pkill ollama with error code: ${code}`);
          reject(new Error(`kill_ollama code ${code}\nstderr: ${stderrData}`));
        }
      });
  
      processDo.on('error', (err) => {
        console.error('kill_ollama error:', err);
        reject(err);
      });
    });
  };

/**
 * 用來刪除Ollama model 占用的記憶體
 */
export const LLMGen_release = async () => {
    try {
        let payload1: object = {
            "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest",
            "prompt": `回答我"好"這一個字就可以了。`,
            "stream": false,
            "options":{
                "num_predict":1
            },
            "keep_alive": 0,
        }
        const release = await LLMGenChat(payload1);
        await kill_ollama();
        return 0;
    } catch (error) {
        console.error(`Error in  LLMGen_release: ${error}`);
        throw error;
    }
}