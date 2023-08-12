"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesModel = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    imagesBase64Code: { type: String, required: true, base64: true },
    imageName: { type: String, required: true },
});
exports.ImagesModel = (0, mongoose_1.model)('images', imageSchema);
