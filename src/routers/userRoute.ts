import { UserController } from "../controller/userController";
import { Route } from "../interfaces/Route";
import { authMiddleware } from "../utils/multer";

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
        this.router.post(`${this.url}/login`, this.Controller.Login);
        this.router.post(`${this.url}/adduser`, this.Controller.AddUser);
        this.router.delete(`${this.url}/deluser`, authMiddleware, this.Controller.DeleteUser);
        this.router.post(`${this.url}/addfav`, authMiddleware, this.Controller.AddFavorite);
        this.router.post(`${this.url}/remfav`, authMiddleware, this.Controller.RemoveFavorite);
    }
}