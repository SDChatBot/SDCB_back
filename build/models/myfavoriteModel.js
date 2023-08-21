"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myfavoriteModel = void 0;
const mongoose_1 = require("mongoose");
const myfavoriteSchema = new mongoose_1.Schema({
    imageName: { type: String, required: true },
    is_favorite: { type: Boolean, required: true },
    addDate: { type: Date, required: true },
    tagName: { type: String, required: true },
});
exports.myfavoriteModel = (0, mongoose_1.model)('myfavorite', myfavoriteSchema);
