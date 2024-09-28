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
export const getVoices = async (Saved_storyID: string, storyTale: string): Promise<{ audioFileName: string, audioBuffer: ArrayBuffer }> => {
    const url = `${process.env.GPT_SOVITS_VOICE_API}?text=${encodeURIComponent(storyTale)}&text_language=zh`;
    try {
        const response = await fetch(url, { method: 'GET' });
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
    const gptWeightsDir = '/home/b310-21/projects/GPT-SoVITS/GPT_weights/';
    const sovitsWeightsDir = '/home/b310-21/projects/GPT-SoVITS/SoVITS_weights';

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
        const response = await fetch('http://163.13.202.120:9880/set_model', requestOptions);
        const result = await response.text();
        
        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態碼：${response.status}, 回應：${result}`);
        }
        console.log(`設置模型結果：${result}`);
        
        return {code:200, message:result};
    } catch (error) {
        console.error("設置語音模型時出錯:", error);
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


