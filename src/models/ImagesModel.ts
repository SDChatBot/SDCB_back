import { Schema, model } from "mongoose";
import { imagesInterface } from "../interfaces/imagesInterface";

const imageSchema = new Schema<imagesInterface>({
    images: { type: [String], required: true},
    parameters:{type: {}, required:true },
    imageInfo:{type:String, required:true},
});

export const imageModel = model<imagesInterface>('imageModel', imageSchema);