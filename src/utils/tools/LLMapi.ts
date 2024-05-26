import { DataBase } from "../DataBase";
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
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
        },
        body: JSON.stringify(storyInfo),
    };
    try {
        const response = await fetch(process.env.LLM_generate_api!, requestOptions);
        if (response.ok) {
            const story = await response.json();
            return story.textResponse;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error) {
        console.error(`LLMGenChat fail: ${error}`);
        throw error;
    }
}

export declare let generated_story_array:string[];

/**
 * 生成完整的故事內容(送了兩次請求，一次生成，一次修改)
 * @param {string} storyInfo 想生成的故事主題 
 * @param {Response} Response 回應status code，不回傳其他東西
 * @return {string[]} generated_story_array 切片後的故事片段
 */
export const LLMGenStory_1st_2nd = async (storyInfo:string, Response:any) =>{
    try {
        // 第一次生成
        let payload1:object = {
            "message": `用繁體中文幫我生成一篇關於${storyInfo}的600到700字適合小孩子的故事，並大約100字使用"\n"換行，以下是一個簡單的故事範例:\n在遙遠的小鎮上，有一座美輪美奐的城堡，它叫做「彩虹王國」，這裡住著一個善良又聰明的國王和他的美麗王后。他們有三個可愛的孩子，分別是大哥哥、小妹妹和我——你！\n有一天，我決定去探險，走進那條七色彩虹的小巷，心想：「今天我要發現彩虹王國裡最神奇的建築物！」於是，我興沖沖地跑著，看看能找到什麼好東西。\n第一棟房子，看起來就像一座巨型蛋糕！它有五層樓高，窗戶都是圓形的，就像裝滿糖霜的餅乾一樣。我推開門，哇！裡面是個甜蜜的夢工廠，我看到許多小精靈在那兒忙著做各式各樣的甜點。\n第二棟房子，則像是座漂浮的城堡，它矗立在空中的湖泊上，看起來好像仙女的水晶球。我好奇地走進去，發現這裡是個音樂之家，有小動物們演奏著最美妙的歌曲，我跟著他們一起跳舞，簡直太開心了！\n第三棟房子，則是一座樹屋！它被高大的樹木包圍，看起來就像一株巨型的綠色寶盒。我爬上去，發現這裡是個藏書室，有無數本關於自然和動物的書籍，我整個人都變成了一個小學霸了！\n接著，我走到第四棟房子，它有好多隻可愛的動物在院子裡玩耍。我跟牠們一起跑跳，還和一隻友善的兔子成為好朋友。我們一起在草地上野餐，吃著美味的蔬菜和水果，真是一大享受！\n第五棟房子，則是彩虹王國的藝術館，我走進去，發現牆上掛滿了色彩斑斕的畫作和雕塑。我看到許多藝術家在那裡創作著美麗的作品，我決定也來嘗試一下，我拿起了一支畫筆，就畫出了一幅美輪美奐的風景畫！\n接下來，我來到了第六棟房子，這是一座科學實驗室，有各式各樣的儀器和工具。我跟著一位聰明的科學家一起做實驗，看看火焰會變成什麼顏色，還有其他神奇的化學反應。\n第七棟房子，是一個溫暖的小屋，我走進去，發現這裡是個手工藝坊。我看到許多居民在那兒編織、縫紉和雕刻各種精美的手工藝品。我也嘗試著做了一件小東西，就是一隻用樹葉做成的翅膀小夜燈，真得好看極了！\n第八棟房子，則是一座運動中心，有籃球場、足球場和網球場等設施。我和我的兄弟姐妹一起玩耍，在那兒打了許多次球，流了滿身大汗，但真是太開心了！\n最後，我來到了第十棟房子，它是一座美麗的花園，有各式各樣的花朵、樹木和香草。我在這裡散步，聞著空氣中瀰漫著的香味，還吃到了許多鮮甜的水果。\n在彩虹王國的旅程結束時，我心滿意足地回到城堡，跟爸媽和弟弟妹妹們分享了我今天所發現的一切。他們都很驚訝我的冒險經歷，也很高興我找到了這麼多珍貴的寶藏。\n從此以後，我經常回去彩虹王國，探索那些奇妙的建築和秘密。我知道，這裡充滿著無限的可能，只要我敢於去發現，就一定能找到令人驚嘆的寶藏！\n希望你也喜歡這個關於彩虹王國10棟建築的故事！如果還有其他問題或需要幫助，請不要猶豫，告訴我吧。謝謝閱讀我的故事，下次見喔！。請你以以下格式回答我的問題: {故事內容}。`,
            "mode": "chat"
        };
        const story_1st = await LLMGenChat(payload1);
        // console.log(`story_1st success`);
        // 第二次生成
        let payload2 = {
            "message": `幫我檢視並修改以下故事，使用生動、活潑、有趣、的口語重新描述一遍故事，並確保故事是600到700字適合小孩子的故事，並大約100字使用"\n"換行，僅須回答我修改後的故事內容，不用回覆我其他與故事無關的訊息，包括修改故事哪些部分等無用訊息。最後使用繁體中文回應所有答覆。最後這是我要修改的故事: ${story_1st}`,
            "mode": "chat"
        };
        const story_2nd:string = await LLMGenChat(payload2);
        // console.log(`story_2nd success`);
        if (story_2nd !== "") {
            generated_story_array = story_2nd.split("\n");
            // console.log(`generated_story_array = ${generated_story_array}`);
            DataBase.SaveNewStory(storyInfo, story_2nd, Response);
            return generated_story_array;
        }
    } catch (error) {
        console.error(`Error in LLMGenStory_1st_2nd: ${error}`);
        Response.status(500).send('Internal Server Error');
    }
}