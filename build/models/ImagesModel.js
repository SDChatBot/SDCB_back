"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageModel = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    images: { type: [String], required: true },
    parameters: { type: {}, required: true },
    imageInfo: { type: String, required: true },
});
exports.imageModel = (0, mongoose_1.model)('imageModel', imageSchema);
