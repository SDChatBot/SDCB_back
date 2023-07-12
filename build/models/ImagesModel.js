"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageModel = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    SerialNumber: { type: String, required: true },
    SerialNumber_Transcoding: { type: String, required: true },
});
exports.imageModel = (0, mongoose_1.model)('imageModel', imageSchema);
