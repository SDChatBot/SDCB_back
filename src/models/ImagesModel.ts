import { Schema, model } from "mongoose";
import { imagesInterface } from "../interfaces/imagesInterface";

const imageSchema = new Schema<imagesInterface>({
    imagesBase64Code: {type: String, required: true, base64:true},
    imageName: {type: String, required: true},
});

export const ImagesModel = model<imagesInterface>('images', imageSchema);