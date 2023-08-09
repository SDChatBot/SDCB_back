import express from 'express';
import { DataBase } from './utils/DataBase';
import fetchImage from './utils/tools/fetch';

const app = express()
const port = 7809
const DB = new DataBase("mongodb://192.168.1.26:2425");

app.use((req:any, res:any, nest)=>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:707');
});

app.set("view engine", "ejs")

app.get('/',(req:any, res: any)=>{
    res.send('Hello World')
});

app.post('/image', (req: any, res: any) => {
    try {
        fetchImage().then((val) => {
            //console.log(val)
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

app.get('/index',(req:any, res:any)=>{
    //res.send('index')
    res.render("index")
});


app.listen(port, () => {
    console.log(`Use this url: http://127.0.0.1:${port}`)
    console.log(`http://127.0.0.1:${port}/image`)
});