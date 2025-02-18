import {BasicModuleInterface} from "~/composables/core/modules/module.interface";
import UsersService from "~/composables/core/modules/users/users.service";

export class UsersModule implements BasicModuleInterface {
    private usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();
    }

    async get(params:object = {}) {
        return await this.usersService.get(params);
    }

    async getById(id:any): Promise<any> {
        return await this.usersService.getFirst(id);
    }

    async post(data:any): Promise<any> {
        return await this.usersService.post(data);
    }

    async put(id:any, data:object): Promise<any> {
        return await this.usersService.put(id, data);
    }

    async patch(id:any, data:object): Promise<any> {
        return await this.usersService.patch(id, data);
    }

    async delete(id:any): Promise<any> {
        return await this.usersService.delete(id);
    }
}

export default UsersModule;
