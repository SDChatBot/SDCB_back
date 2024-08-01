import { getVoices } from "../tools/fetch";
import fs from 'fs/promises';
import path from 'path';  

export const CurrentTime = () =>{
    const now=new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedTime = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
}

export const GenVoice = async (storyId:string, storyTale:string) => {
    try {
        const { audioFileName, audioBuffer } = await getVoices(storyId, storyTale);
        const filePath = path.join(process.env.dev_saveAudio!, audioFileName);
        await fs.writeFile(filePath, Buffer.from(audioBuffer));
        
        console.log(`Voice generated successfully, and saved success`);
    } catch (error) {
        console.error("Error in GenVoice: ", error);
    }
}

//  判斷物件內的屬性是否都存在
export function isObjectValid(obj: any | null | undefined): boolean {
    if (!obj) return false;
    
    // 該函式會返回 true 如果物件的每個屬性都不為 null、undefined
    return Object.values(obj).every(value => 
        value !== null && 
        value !== undefined && 
        (Array.isArray(value) ? value.length > 0 : true)
    );
}

export interface sdmodel_back{
    sd_name: string,
    show_name: string,
}
// sd模型列表
export const sdmodel_list: sdmodel_back[] = [
    { sd_name: 'AnythingXL_xl.safetensors [8421598e93]', show_name: '超可愛動漫風格' },
    { sd_name: 'rachelWalkerStyle_v1.ckpt', show_name: '水彩畫風格' },
    { sd_name: 'splatterPunkXL_v10.safetensors', show_name: '賽博龐克風格' },
    { sd_name: 'oxalisAnimeScreencap_animeScreencap.safetensors', show_name: '日本動漫風格' },
    { sd_name: 'cartoonmix_v10.safetensors', show_name: '3D卡通風格' },
    { sd_name: 'disneyPixarCartoon_v10.safetensors', show_name: '皮克斯、迪士尼卡通風格' },
    { sd_name: '90sCartoonXL_v09Alpha.safetensors [9b723603f2]', show_name: '90年代卡通風格' },
    { sd_name: 'cuteCATCuteCitron_v2.safetensors', show_name: 'Q版漫畫風格' },
    { sd_name: 'fantasyWorld_v10.safetensors', show_name: '奇幻風格' },
    { sd_name: 'flat2DAnimerge_v45Sharp.safetensors', show_name: '2D動漫風格' },
    { sd_name: 'mechaMusumeMerged_mechaMusumeVividSoft.safetensors', show_name: '機械風格' },
    { sd_name: 'slatePencilMix_v10.safetensors', show_name: '素描風格' },
    { sd_name: 'ChineseInkComicStrip_v10.ckpt', show_name: '中國傳統水墨畫' },
    { sd_name: `cemremixRealistic_v10Pruned.safetensors`, show_name: `真實感` },
    { sd_name: `pixelArtDiffusionXL_spriteShaper.safetensors`, show_name: `像素風` },
    { sd_name: `handDrawnPortrait_v10.safetensors`, show_name: `手繪` },
    { sd_name: `splatterPunkNeon_v17Illustration.safetensors`, show_name: `賽博龐克風格` },
    { sd_name: `solsticeAKoreanWebtoon_v10AreumNoemaFp16.safetensors`, show_name: `韓漫` },
    { sd_name: `paintersCheckpointOilPaint_v11.safetensors`, show_name: `油畫` }
]

export function caseSdModelUse(storyStyle:string){
    let payload = {
        sd_name:"", // 要請求的模型名稱
        exclusive_prompt:"", // 專屬生成圖片的prompt
        negative_prompt:"" // 禁用詞
    }
    // TODO 寫一個可以快速查詢sdmodel_list回傳sd_name的函數（或者可以不用那麼麻煩，這部分在前端處理也可以）
    switch (storyStyle){
        case "AnythingXL_xl.safetensors [8421598e93]":{
            payload.sd_name = "AnythingXL_xl.safetensors [8421598e93]" ;
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        
        }
        case "rachelWalkerStyle_v1.ckpt":{
            payload.sd_name = "rachelWalkerStyle_v1.ckpt" ;
            payload.exclusive_prompt = "a watercolor painting of an owl in the evening in the rachelwalker style, high quality, denoise, clean, masterpiece, best quality, highres, intricate details, 4k, stunning" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        
        }
        case "":{}
        default:{
            payload.sd_name = "AnythingXL_xl.safetensors [8421598e93]" ;
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        

        }
    }
}
