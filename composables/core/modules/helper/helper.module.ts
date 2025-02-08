import {BasicModuleInterface} from "~/composables/core/modules/module.interface";
import HelperService from "~/composables/core/modules/helper/helper.service";

export class HelperModule {
    private helperService: HelperService;

    constructor() {
        this.helperService = new HelperService();
    }

    async validationIsUnique(params:object = {}) {
        return await this.helperService.validationIsUnique(params);
    }
}

export default HelperModule;
