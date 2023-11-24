"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyModel = void 0;
const mongoose_1 = require("mongoose");
const storySchema = new mongoose_1.Schema({
    storyTale: { type: String, required: true },
    storyInfo: { type: String, required: true },
});
exports.storyModel = (0, mongoose_1.model)('stories', storySchema);
