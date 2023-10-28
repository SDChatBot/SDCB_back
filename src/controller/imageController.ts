import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { fetchImage } from "../utils/tools/fetch";
import { DataBase } from "../utils/DataBase";
// import { saveBase64Image } from "../utils/tools/saveImage";


export class ImageController extends Controller {
    public test(Request:Request, Response:Response){
        Response.send(`Hello imageRoute`)
    }
    public getImage(Request:Request, Response:Response){
        const imageData = Request.body;
        // console.log(`imageData = ${JSON.stringify(imageData)}`);
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
                // let imageSaveData = `${val}`
                //console.log(`imageSaveData = ${imageSaveData}`)
                // DataBase.SaveNewImage(imageSaveData);
                // Response.json(val);
                Response.send(val)
            }).catch((e) => {
                console.log(`run time error`)
            })
            //res.send(fetchImage());
        } catch (e) {
            console.log(`fetchImage fail: ${e}`)
            Response.status(500).send('/image post run wrong ');
        }
    }

    public getimageprmopt(request: Request, response: Response) {
        const imageData = request.body;
        let payload = {
            "prompt": imageData.imagepropmts,
            "seed": -1,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        }
        try {
            fetchImage(payload).then((val) => { //val就是image base64 code
                try {
                    //saveBase64Image(`${val["0"]}`, "test.png")
                    // const keys = Object.keys(val);
                    // console.log(keys);
                    // saveBase64Image(val["0"], "test.png");
                    // response.send(val["0"]);
                } catch (e) {
                    console.error(`Error saving image: ${e}`)
                }
            }).catch((e) => {
                console.log(`Runtime error: ${e}`)
            })
        } catch (e) {
            console.log(`FetchImage error: ${e}`)
            response.status(500).send('/image post run wrong ');
        }
    }

}