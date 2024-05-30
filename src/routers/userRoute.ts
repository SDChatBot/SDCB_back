import { UserController } from "../controller/userController";
import { Route } from "../interfaces/Route";

export class UserRoute extends Route {
    protected url: string = '';
    protected Controller = new UserController;
    constructor() {
        super()
        this.url = '/user';
        this.setRoutes();
    }

    //http://localhost:7943/user
    protected setRoutes(): void {
        this.router.get(`${this.url}`,this.Controller.test);
        this.router.post(`${this.url}/adduser`, this.Controller.AddUser);
    }
}