import { Schema, model } from "mongoose";
import { images } from "../interfaces/images";

const imageSchema = new Schema<images>({
    name:{type: String, required: true},
    SerialNumber:{type: String, required:true},
    SerialNumber_Transcoding:{type:String, required:true},
});

export const imageModel = model<images>('imageModel', imageSchema);