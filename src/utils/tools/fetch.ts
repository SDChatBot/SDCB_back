import dotenv from "dotenv";
dotenv.config();

import fs from 'fs';
import path from 'path';

const findLatestFile = (directory: string, prefix: string): string | null => {
    try {
        const allFiles = fs.readdirSync(directory);
        const filteredFiles = allFiles.filter(file => file.startsWith(prefix) && file.endsWith('.pth'));

        if (filteredFiles.length === 0) {
            console.log('沒有找到符合條件的檔案');
            return null;
        }

        const sortedFiles = filteredFiles.sort((a, b) => {
            const partsA = a.split('_');
            const partsB = b.split('_');
            
            // 比較 e 值
            const eA = parseInt(partsA[1].substring(1));
            const eB = parseInt(partsB[1].substring(1));
            if (eA !== eB) return eB - eA;
            
            // 如果 e 值相同，比較 s 值
            const sA = parseInt(partsA[2].substring(1));
            const sB = parseInt(partsB[2].substring(1));
            return sB - sA;
        });
        console.log(`選擇的檔案：${sortedFiles[0]}`);

        return sortedFiles[0] || null;
    } catch (error) {
        console.error(`查找檔案時出錯：${error}`);
        return null;
    }
};

// whisper 轉文字
export const whisperCall = async (referPathDir: string, firstFile: string) => {
    async function query(filename: string) {
        const data = await fs.promises.readFile(filename);
        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINFACE_API}`,
                    "Content-Type": "application/octet-stream",
                },
                method: "POST",
                body: data,
            }
        );
        const result = await response.json();
        return result;
    }

    try {
        console.log(`referPathDir: ${referPathDir}, firstFile: ${firstFile} join: ${path.join(referPathDir, firstFile)}`);
        const response = await query(path.join(referPathDir, firstFile));
        console.log("whisperCall response:", JSON.stringify(response));
        return response.text;
    } catch (error) {
        console.error("Error in whisperCall:", error);
        throw error;
    }
};

export const fetchImage = async (payload:Object) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    try {
        const response = await fetch(`${process.env.stable_diffusion_api}/sdapi/v1/txt2img`, requestOptions);
        const data = await response.json();
        return data.images; //只回傳image Base64 code
    } catch (error) {
        console.error(`fetchImage fail: ${error}`);
        throw error;
    }
};

// 拿語音內容
export const getVoices = async (Saved_storyID: string, storyTale: string, voiceModelName:string): Promise<{ audioFileName: string, audioBuffer: ArrayBuffer }> => {
    const url = `${process.env.GPT_SOVITS_VOICE_API}/tts`;
    const referPathDir = `/home/b310-21/projects/GPT-SoVITS/output/slicer_opt/${voiceModelName}`
    
    // 獲取排序後的第一個檔案
    const sortedFiles = fs.readdirSync(referPathDir).sort();
    const firstFile = sortedFiles.length > 0 ? sortedFiles[0] : null;
    if (!firstFile) {
        throw new Error(`no file found in ${referPathDir} `);
    }

    const promptText = await whisperCall(referPathDir, firstFile);

    const requestBody = {
        ref_audio_path: path.join(referPathDir, firstFile),
        prompt_text: promptText,
        prompt_lang: "zh",
        text: storyTale,
        text_lang: "zh",
        text_split_method: "cut0",
    };

    console.log(`requestBody: ${JSON.stringify(requestBody)}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const audioFileName = `Saved_${Saved_storyID}.wav`;
        return { audioFileName, audioBuffer };
    } catch (error) {
        console.error("Error fetching voice:", error);
        throw error;
    }
}

// 設定語音模型
export const setVoiceModel = async (modelName: string): Promise<{code:number, message:string}> => {
    const gptWeightsDir = '/home/b310-21/projects/GPT-SoVITS/GPT_weights_v2';
    const sovitsWeightsDir = '/home/b310-21/projects/GPT-SoVITS/SoVITS_weights_v2';

    const latestGptFile = `${gptWeightsDir}/${modelName}-e15.ckpt`;
    const latestSovitsFile = findLatestFile(sovitsWeightsDir, modelName);
    
    if (!latestSovitsFile) {
        throw new Error('找不到匹配的模型檔案');
    }
    
    console.log(`已找到以下兩個模型：${latestGptFile}, ${path.join(sovitsWeightsDir, latestSovitsFile)}`);

    const payload = {
        "gpt_model_path": latestGptFile,
        "sovits_model_path": path.join(sovitsWeightsDir, latestSovitsFile)
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`${process.env.GPT_SOVITS_VOICE_API}/set_model`, requestOptions);
        const result = await response.text();

        if (!response.ok) {
            throw new Error(`setVoiceModel fail code：${response.status}, respomse：${result}`);
        }
        console.log(`setVoiceModel result：${result}`);

        return {code:200, message:result};
    } catch (error) {
        console.error("setVoiceModel occurred error:", error);
        throw error;
    }
}

// //http://163.13.202.120:8188/prompt
// const useComfy3D = `http://163.13.202.120:8188/prompt`
// export const fetchComfy = async(prompt:any) => {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(prompt)
//     };
//     try {
//         const response = await fetch(`${useComfy3D}`, requestOptions);
//         const data = await response.json();
//         return data.images; 
//     } catch (error) {
//         console.log(`Error fetchImage response is ${error}`);
//         return `Error => no return `;
//     }
// }


