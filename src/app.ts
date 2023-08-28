import express from 'express';
import { DataBase } from './utils/DataBase';
import { fetchImage } from './utils/tools/fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AiAnswer } from './utils/opanaiApi';
import http, { createServer } from 'http';
import { Server } from "socket.io";

const app = express()
const port = 7943
const portSocket = 4692
const ip = "192.168.1.26";
const DB = new DataBase("mongodb://192.168.1.26:2425");
const httpServer = createServer();

//socketio client api Dev
const socket_client = `http://localhost:3000`;

// // Use
// const socket_client = `http://192.168.1.26:3000`;


const io = new Server(httpServer, {
    cors: {
        origin: socket_client,
        methods: ["GET", "POST"],
    }
});
let enMsg: string = "";

//聊天室socket伺服器
io.on('connection', (socket) => {
    console.log(`connected Socketio ${socket_client} success`);
    let botRoomId: any;
    // create a new room for the user and bot to chat
    botRoomId = 'bot_room_' + Math.random().toString(36).substr(2, 9);
    socket.join(botRoomId);
    // listen for chat message from user and send it to bot
    socket.on('chat message', (msg) => {
        //console.log(`User said: ${msg}`);
        try {
            AiAnswer(enMsg).then((botReply) => {
                // send bot's reply to all connected users in the room
                io.to(botRoomId).emit('chat message', botReply);
            }).catch((e) => {
                console.log(`get AiAnswer fail, ${e}`);
            });
        } catch (e) {
            console.log(`AiAnswer error: ${e}`)
        }
    });
});


// // dev
// httpServer.listen(portSocket, () => {
//     console.log(`Socket Server: http://localhost:${portSocket}`);
// });


//use
httpServer.listen(portSocket, ip, () => {
    console.log(`Socket Server: http://${ip}:${portSocket}`);
});

//***************************************************************************************************//

//系統伺服器
const corsOptions = {
    origin: [
        'http://localhost:3000', //dev front 
        'http://192.168.1.26:3000', //use front     
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

//app.route()方法
app.route('/image')
    .get((req: any, res: any) => {
        res.send('Hello World')
    })
    .post((req: any, res: any) => {
        const imageData = req.body;
        //console.log(`imageData = ${JSON.stringify(req.body)}`);
        let payload = {
            "prompt": imageData.imagePrompt,
            "seed": -1,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        }
        try {
            fetchImage(payload).then((val) => { //val就是image base64 code
                //console.log(val)
                let imageSaveData = `${val}`
                //console.log(`imageSaveData = ${imageSaveData}`)
                DataBase.SaveNewImage(imageSaveData);
                res.json(val);
            }).catch((e) => {
                console.log(`run time error`)
            })
            //res.send(fetchImage());
        } catch (e) {
            console.log(`fetchImage fail: ${e}`)
            res.status(500).send('/image post run wrong ');
        }
    })

app.post('/prompt', (req: any, res: any) => {
    const userPrompt: string = req.body.prompt || `a Hotdog`;
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
        //console.log(`funcPrompt = ${funcPrompt}`);
        res.send({ imagePrompt: `${prompt}` });
    })

})

//dev 開發
app.listen(port, () => {
    console.log(`Server: http://127.0.0.1:${port}/image`)
});

// //use 使用
// app.listen(port, ip,() => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });