"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const express_1 = require("express");
class Route {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    getRouter() {
        return this.router;
    }
    getUrl() {
        return this.url;
    }
}
exports.Route = Route;
