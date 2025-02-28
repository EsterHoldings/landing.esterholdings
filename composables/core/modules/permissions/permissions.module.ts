import {BasicModuleInterface} from "~/composables/core/modules/module.interface";
import PermissionsService from "~/composables/core/modules/permissions/permissions.service";

export class PermissionsModule implements BasicModuleInterface {
    private permissionsService: PermissionsService;

    constructor() {
        this.permissionsService = new PermissionsService();
    }

    async get(params:object = {}) {
        return await this.permissionsService.get(params);
    }

    async getById(id:any): Promise<any> {
        return await this.permissionsService.getFirst(id);
    }

    async post(data:any): Promise<any> {
        return await this.permissionsService.post(data);
    }

    async put(id:any, data:object): Promise<any> {
        return await this.permissionsService.put(id, data);
    }

    async patch(id:any, data:object): Promise<any> {
        return await this.permissionsService.patch(id, data);
    }

    async delete(id:any): Promise<any> {
        return await this.permissionsService.delete(id);
    }
}

export default PermissionsModule;
