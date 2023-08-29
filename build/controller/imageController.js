"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const Controller_1 = require("../interfaces/Controller");
const fetch_1 = require("../utils/tools/fetch");
const DataBase_1 = require("../utils/DataBase");
class ImageController extends Controller_1.Controller {
    test(Request, Response) {
        Response.send(`Hello imageRoute`);
    }
    getImage(Request, Response) {
        const imageData = Request.body;
        //console.log(`imageData = ${JSON.stringify(Request.body)}`);
        let payload = {
            "prompt": imageData.imagePrompt,
            "seed": -1,
            "cfg_scale": 7,
            "step": 2,
            "enable_hr": false,
            "denoising_strength": 100,
            "restore_faces": false,
        };
        try {
            (0, fetch_1.fetchImage)(payload).then((val) => {
                //console.log(val)
                let imageSaveData = `${val}`;
                //console.log(`imageSaveData = ${imageSaveData}`)
                DataBase_1.DataBase.SaveNewImage(imageSaveData);
                Response.json(val);
            }).catch((e) => {
                console.log(`run time error`);
            });
            //res.send(fetchImage());
        }
        catch (e) {
            console.log(`fetchImage fail: ${e}`);
            Response.status(500).send('/image post run wrong ');
        }
    }
}
exports.ImageController = ImageController;
