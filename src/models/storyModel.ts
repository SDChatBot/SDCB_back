import { Schema, model } from "mongoose";
import { storyInterface } from "../interfaces/storyInterface";

const storySchema = new Schema<storyInterface>({
   storyTale: { type: String, required: true },
   storyInfo: { type: String, required: true },
   image_prompt:{type:Array<String>, required:false},
   image_base64: {type:Array<String>, required:false},
});

export const storyModel = model<storyInterface>('stories', storySchema);