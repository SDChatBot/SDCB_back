import { Schema, model } from "mongoose";
import { storyInterface } from "../interfaces/storyInterface";

const storySchema = new Schema<storyInterface>({
   storyTale: { type: String, required: true },
   storyInfo: { type: String, required: true },
});

export const storyModel = model<storyInterface>('stories', storySchema);