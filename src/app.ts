import express from 'express';
import { DataBase } from './utils/DataBase';
import {fetchImage} from './utils/tools/fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AiAnswer } from './utils/opanaiApi';
import http,{createServer} from 'http';
import { Server } from "socket.io";

const app = express()
const port = 7943
const portSocket = 450
const ip = "192.168.1.26";
const DB = new DataBase("mongodb://192.168.1.26:2425");
const httpServer = createServer();

 //socketio client api
const socket_client = `http://localhost:3000`;
//const socket_client = `http://localhost:6532`;
const io = new Server(httpServer, {
    cors: {
        origin: socket_client,
        methods: ["GET", "POST"],
    }
});

//聊天室socket伺服器
io.on('connection', (socket) => {
    console.log(`connected ${socket_client} success`);
    let botRoomId:any;
    // create a new room for the user and bot to chat
    botRoomId = 'bot_room_' + Math.random().toString(36).substr(2, 9);
    socket.join(botRoomId);
    // listen for chat message from user and send it to bot
    socket.on('chat message', (msg) => {
        console.log(`User said: ${msg}`);
        try{
            AiAnswer(msg).then((botReply)=>{
                // send bot's reply to all connected users in the room
                io.to(botRoomId).emit('chat message', botReply);
            }).catch((e)=>{
                console.log(`get AiAnswer fail, ${e}`);
            });
        }catch(e){
            console.log(`AiAnswer error: ${e}`)
        }
        
    });
});


// dev
httpServer.listen(portSocket, () => {
    console.log(`Socket Server: http://localhost:${portSocket}`);
});

// // Use
// httpServer.listen(portSocket, () => {
//     console.log(`Socket Server: http://${ip}:${portSocket}`);
// });

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
            prompt: imageData.prompt,
            seed: -1,
            cfg_scale: 7,
            step: 2,
        };
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


//dev 開發
app.listen(port, () => {
    console.log(`Server: http://127.0.0.1:${port}/image`)
});

// //use 使用
// app.listen(port, ip,() => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });