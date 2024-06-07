import { Schema, model } from "mongoose";
import { myfavoriteInterface } from "../interfaces/myfavoriteInterface";

const myfavoriteSchema = new Schema<myfavoriteInterface>({
    is_favorite: { type: Boolean, required: true },
    addDate: { type: Date, required: true },
    tagName: { type: String, required: true },
});

export const myfavoriteModel = model<myfavoriteInterface>('myfavorite', myfavoriteSchema);