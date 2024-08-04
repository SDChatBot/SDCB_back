export interface sdmodel_back{
    sd_name: string,
    show_name: string,
}

// sd模型列表
export const sdmodel_list: sdmodel_back[] = [
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
    switch (storyStyle){
        // 超可愛動漫風格
        case "AnythingXL_xl.safetensors [8421598e93]":{
            payload.sd_name = "AnythingXL_xl.safetensors [8421598e93]" ;
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        
            break;
        }
        
        // 水彩畫風格
        case "rachelWalkerStyle_v1.ckpt [54ded95d83]":{
            payload.sd_name = "rachelWalkerStyle_v1.ckpt" ;
            payload.exclusive_prompt = "a watercolor painting of an owl in the evening in the rachelwalker style, high quality, denoise, clean, masterpiece, best quality, highres, intricate details, 4k, stunning" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        
            break;
        }

        // 賽博龐克風格
        case "splatterPunkXL_v10.safetensors [b5730102eb]":{
            payload.sd_name = "splatterPunkXL_v10.safetensors" ;
            payload.exclusive_prompt = "nvinkpunk, (masterpiece, best quality, ultra-detailed, highres, best illustration), heterochromia, side lighting, lustrous skin, ray tracing,detailed hair, detailed face, depth_of_field, very detailed background, extreme light and shadow, (detailed eyes), perfect anatomy, Floating, dynamic angle, wide shot, full body, city scape , extreme light and shadow, night sky, outrun, electric light wires, neon outlines, illustrated";
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, Realism, worst quality, bad quality, poor quality, blurry, zombie, ugly, cropped, out of frame, photo, Fujifilm XT3, depth of field, bokeh, noise, film grain";        
            break;
        }

        // 日本動漫風格
        case "oxalisAnimeScreencap_animeScreencap.safetensors":{
            payload.sd_name = "oxalisAnimeScreencap_animeScreencap.safetensors" ;
            payload.exclusive_prompt = "masterpiece, best quality, high quality, ultra-detailed, best details, finely detail";
            payload.negative_prompt = "low quality, worst quality, Anime Support-neg, Anti 3d Reality, bad_prompt_version2-neg, By bad artist -neg, EasyNegativeV2, FastNegativeV2, NGH, NIV-neg, SimpleNegativeV3, verybadimagenegative_v1.3";        
            break;
        }

        // 3D卡通風格
        case "cartoonmix_v10.safetensors [730ecbe46a]":{
            payload.sd_name = "cartoonmix_v10.safetensors" ;
            payload.exclusive_prompt = "Best quality,masterpiece,ultra high res,\\\(photorealistic:1.4\\\),raw photo,Kodak portra 400,film grain,aki001,extremely detailed CG unity 8k wallpaper,close up";
            payload.negative_prompt = "low quality, worst quality, Anime Support-neg, Anti 3d Reality, bad_prompt_version2-neg, By bad artist -neg, EasyNegativeV2, FastNegativeV2, NGH, NIV-neg, SimpleNegativeV3, verybadimagenegative_v1.3, bad-hands-5 EasyNegativeV2 ng_deepnegative_v1_75t";        
            break;
        }

        // 皮克斯、迪士尼卡通風格
        case "disneyPixarCartoon_v10.safetensors":{
            payload.sd_name = "disneyPixarCartoon_v10.safetensors" ;
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean";
            payload.negative_prompt = "EasyNegative, drawn by bad-artist, sketch by bad-artist-anime, (bad_prompt:0.8), (artist name, signature, watermark:1.4), (ugly:1.2), (worst quality, poor details:1.4), bad-hands-5, badhandv4, blurry";
            break;
        }

        // 90年代卡通風格
        case "90sCartoonXL_v09Alpha.safetensors [9b723603f2]":{
            payload.sd_name = "90sCartoonXL_v09Alpha.safetensors [9b723603f2]" ;
            payload.exclusive_prompt = "source_anime, solo, cartoon ,score_9_eyes";
            payload.negative_prompt = "EasyNegative, drawn by bad-artist, sketch by bad-artist-anime, (bad_prompt:0.8), (artist name, signature, watermark:1.4), (ugly:1.2), (worst quality, poor details:1.4), bad-hands-5, badhandv4, blurry, extra text, punjabi, 5 fingers, 3 fingers";
            break;
        }

        // Q版漫畫風格
        case "cuteCATCuteCitron_v2.safetensors [c75902b553]":{
            payload.sd_name = "cuteCATCuteCitron_v2.safetensors";
            payload.exclusive_prompt = "masterpiece, best quality, highres,standing, cowboy shot, outdoors";
            payload.negative_prompt = "EasyNegative, (worst quality, low quality:1.0), badhandv4, ng_deepnegative_v1_75t";
            break;
        }

        // 奇幻風格
        case "fantasyWorld_v10.safetensors":{
            payload.sd_name = "fantasyWorld_v10.safetensors";
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean";
            payload.negative_prompt = "1girl,text,word,cropped,low quality,normal quality,username,watermark,signature,blurry,soft,soft line,curved line,sketch,ugly,logo,pixelated,lowres,cloud";
            break;
        }

        // 2D動漫風格
        case "flat2DAnimerge_v45Sharp.safetensors":{
            payload.sd_name = "flat2DAnimerge_v45Sharp.safetensors";
            payload.exclusive_prompt = "(best quality:0.8) perfect anime illustration ,perfect anime still frame, masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean";
            payload.negative_prompt = "(worst quality:0.8),verybadimagenegative_v1.3,(surreal:0.8), (modernism:0.8), (art deco:0.8), (art nouveau:0.8)";
            break;
        }


        default:{
            payload.sd_name = "AnythingXL_xl.safetensors [8421598e93]" ;
            payload.exclusive_prompt = "masterpiece, best quality, highres, intricate details, 4k, stunning, high quality, denoise, clean" ;
            payload.negative_prompt = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name" ;        
            break;
        }
    }

    return payload;
}