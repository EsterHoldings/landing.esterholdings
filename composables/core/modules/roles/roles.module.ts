import {BasicModuleInterface} from "~/composables/core/modules/module.interface";
import RolesService from "~/composables/core/modules/roles/roles.service";

export class RolesModule implements BasicModuleInterface {
    private rolesService: RolesService;

    constructor() {
        this.rolesService = new RolesService();
    }

    async get(params:object = {}) {
        return await this.rolesService.get(params);
    }

    async getById(id:any): Promise<any> {
        return await this.rolesService.getById(id);
    }

    async post(data:any): Promise<any> {
        return await this.rolesService.post(data);
    }

    async put(id:any, data:object): Promise<any> {
        return await this.rolesService.put(id, data);
    }

    async patch(id:any, data:object): Promise<any> {
        return await this.rolesService.patch(id, data);
    }

    async delete(id:any): Promise<any> {
        return await this.rolesService.delete(id);
    }
}

export default RolesModule;
