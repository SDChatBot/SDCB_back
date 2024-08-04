import dotenv from 'dotenv';
dotenv.config();

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

export const getVoices = async (Saved_storyID: string, storyTale: string): Promise<{ audioFileName: string, audioBuffer: ArrayBuffer }> => {
    const url = `http://163.13.202.120:9880/?text=${encodeURIComponent(storyTale)}&text_language=zh`;
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const audioBuffer = await response.arrayBuffer();
        const audioFileName = `Saved_${Saved_storyID}.wav`;
        return { audioFileName, audioBuffer };
    } catch (error) {
        console.error("Error fetching voice:", error);
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


