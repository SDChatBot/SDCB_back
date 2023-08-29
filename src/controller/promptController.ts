import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { AiAnswer } from '../utils/opanaiApi';

export class PromptController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`this is prompt get, use post in this url is FINE !`);
    }
    public GenerPicPrompt(Request:Request, Response:Response){
        const userPrompt: string = Request.body.prompt || `a Hotdog`;
        //console.log(`userPrompt = ${JSON.stringify(userPrompt)}`);

        const funcPrompt: string = `用${userPrompt}設計一個120字以內的英文圖片提示。
    如果我今天明確提到了我想生成的圖片，你將根據描述為我設計一個單一想法的英文圖片提示。
    只需用英文回答關於圖片提示即可，其他通知、回答的訊息皆省略跳過。
    生成的參考例子如: 
    一只灰白相间的猫咪正在舒服地蜷在一个温暖的毛毯上，闭着眼睛，微微张开嘴巴，展现出放松和满足的表情。它的毛发柔软顺滑，有一双明亮的绿色眼睛，散发着友善和安静的气息。、
    一隻黑色的狗，它與另一隻白狗正在追逐一個球，表示出它們是最好的朋友。、
    進入公園，你會被景色所陶醉：中央巍峨噴泉，高達十米的水柱繪出繽紛彩虹。噴泉旁的湖水清澈，湖底盡收眼底。湖畔區有游泳池和水上遊樂，供玩耍。寬廣草坪適合野餐、運動，繽紛花朵吸引、
    一架彩虹色的熱氣球在蔚藍天空中自由飛行，下方有一片綠意盎然的森林。、
    一隻可愛的貓咪正坐在圓形的地毯上，四周是彩色的聖誕球和禮物。咪咪的眼睛亮晶晶地看著一個正在降落的聖誕老人，聖誕老人正抱著一個大大的袋子懸浮在空中。咪咪的尾巴翹得高高，顯示它的興奮和期待。整個場景充滿了節日的氛圍，讓人感到愉快和期待。、
    `
        AiAnswer(funcPrompt).then((prompt: string | null) => {
            console.log(`prompt = ${prompt}`);
            Response.send({ imagePrompt: `${prompt}` });
        })
    }
}