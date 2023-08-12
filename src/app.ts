import express from 'express';
import { DataBase } from './utils/DataBase';
import fetchImage from './utils/tools/fetch';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express()
const port = 810
const DB = new DataBase("mongodb://sdcb:sdcbpassword@192.168.1.26:2425");

const corsOptions = {
    origin: [
        'http://localhost:707',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/image',(req:any, res: any)=>{
    res.send('Hello World')
});

app.post('/image', (req: any, res: any) => {
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
});


app.listen(port, () => {
    console.log(`Use this url: http://127.0.0.1:${port}/image`)
    console.log(`http://127.0.0.1:${port}/image`)
});