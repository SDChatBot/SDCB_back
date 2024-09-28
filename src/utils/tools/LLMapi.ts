import { DataBase } from "../DataBase";
import { RoleFormInterface } from "../../interfaces/RoleFormInterface";
import { spawn } from "child_process";
import OpenCC from 'opencc-js';
import { Ollama, GenerateRequest } from 'ollama'

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


export const LLMGenChat = async (storyInfo: any): Promise<string> => {
    const ollama = new Ollama({ host: process.env.LLM_generate_api });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.log("\nAborting LLMGenChat request...\n");
        controller.abort();
    }, 60000);

    try {
        const ollamaRequest: GenerateRequest & { stream: false } = { ...storyInfo, stream: false, signal: controller.signal };
        const response = await ollama.generate(ollamaRequest);
        clearTimeout(timeoutId);
        let string_response = response.response;
        return string_response;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            await LLMGen_release();
            console.error(`LLMGenChat Request timed out after 60 seconds, ${error}`);
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
            "model": "Llama3.1-8B-Chinese-Chat.Q8_0.gguf:latest",
            "prompt": `
                <|begin_of_text|><|start_header_id|>system<|end_header_id|>
                你是一位專業的兒童故事作家,擅長創作適合小朋友閱讀的有趣故事。請根據以下要求創作一個故事:

                故事主角: ${storyRoleForm.mainCharacter}
                其他角色: ${storyRoleForm.otherCharacters} 
                故事情節: ${storyRoleForm.description}

                要求:
                1. 故事總字數控制在700字左右
                2. 每40個字換一次行
                3. 全文分為10-12個段落
                4. 故事內容要充實有趣,符合小朋友的理解能力
                5. 角色對話要生動自然,符合故事情境
                6. 只輸出故事內容,不要包含任何額外說明

                請發揮你的創意,為小朋友們創作一個精彩的故事!

                <|eot_id|><|start_header_id|>user<|end_header_id|>

                請根據上述要求創作一個適合兒童的故事。

                <|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
            "stream": false,
            "options":{
                "num_ctx": 700,
                "num_predict": 100,
            },
        }
        const story_1st = await LLMGenChat(payload1);

        // 第二次生成
        let payload2 = {
            "model": "Llama3.1-8B-Chinese-Chat.Q8_0.gguf:latest",
            // "model": "Whispertales_model_v4.gguf:latest",
            "prompt": `<|begin_of_text|><|start_header_id|>system<|end_header_id|>你是一位專門為小朋友創作有趣故事的AI助手。請根據以下提示生成一個適合小朋友閱讀的故事。每40字換行，總段落數不超過12段，字數控制在600字左右。<|eot_id|><|start_header_id|>user<|end_header_id|>請修改並優化以下故事：${story_1st}，使其更生動有趣。請確保故事字數接近600字，每40字換行，總段落數不超過12段。只需返回修改後的故事內容，不要附加其他說明。<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
            "stream": false,
            "options":{
                "num_ctx": 700, // num_ctx num_predict
                "num_predict": 100,
            },
        };
        const story_2nd:string = await LLMGenChat(payload2);

        const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
        const transStory: string = converter(story_2nd);
        
        if (transStory !== "") {
            generated_story_array = transStory.split("\n\n");
            console.log(`generated_story_arrayAA.length = ${generated_story_array.length}`);
            let Saved_storyID = await DataBase.SaveNewStory_returnID(transStory, storyInfo);
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
    const ollama = new Ollama({ host: 'http://163.13.202.120:11434' })
    try {
        let payload1: object = {
            "model": "Llama3.1-8B-Chinese-Chat.Q8_0.gguf:latest",
            "prompt": `回答我"好"這一個字就可以了。`,
            "stream": false,
            "options":{
                "num_predict": 1,
                "num_ctx": 1
            },
            "keep_alive": 0,
        }
        await ollama.generate(payload1 as GenerateRequest & { stream: false });
        // await kill_ollama();
        return 0;
    } catch (error) {
        console.error(`LLMGen_release 中發生錯誤：${error}`);
        throw error;
    }
}