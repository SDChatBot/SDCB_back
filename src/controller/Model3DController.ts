import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";

import { setImage2Model_workflow2 } from "../utils/workflow/Model3D_workflow2";
import { imageName } from "../utils/multer";
import { fetchComfy } from "../utils/tools/fetch";

export class Model3DController extends Controller {
   public test(Request:Request, Response:Response){
      // console.log(`comfyWorkflows: ${comfyWorkflows.Model3D_workflow2}`);
      Response.send(`Hello 3D`);
   }


   public uploadImageInComfyui(Request:Request, Response:Response){
      // console.log(`imageName: ${imageName}`);
      let workflow = setImage2Model_workflow2(imageName);
      
      const queue_prompt = () => {
         let data = { "prompt": workflow }
         // console.log(`data: ${JSON.stringify(data)}`)
         fetchComfy(data).then(()=>{
            console.log("post success");
         }).catch((e)=>{
            console.error((`fetchComfy fail with error: ${e}`))
         })
      };

      queue_prompt();
   }
}