import { imagesInterface } from '../../interfaces/imagesInterface';

const url = "http://163.13.201.153:7860/"; //http://163.13.201.153:7860/sdapi/v1/txt2img

let imagesBase64:string[]
//生成圖片(stable diffusion)
export const fetchImage = async (payload:Object) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    try {
        const response = await fetch(`${url}sdapi/v1/txt2img`, requestOptions);
        const data = await response.json();
        return data.images; //只回傳image Base64 code
    } catch (error) {
        console.log(`Error fetchImage response is ${error}`);
        return `Error => no return `;
    }
};

// //http://163.13.201.153:8188/prompt
// const useComfy3D = `http://163.13.201.153:8188/prompt`
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