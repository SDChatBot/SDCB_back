import { Router } from "express"
import { Controller } from "./Controller"

export abstract class Route {

    protected abstract url: string

    protected abstract Controller: Controller

    protected router = Router()

    protected abstract setRoutes(): void

    public getRouter() {
        return this.router
    }

    public getUrl() {
        return this.url
    }
}