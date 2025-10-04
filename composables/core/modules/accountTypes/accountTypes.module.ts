import {BasicModuleInterface} from "../module.interface";
import AccountTypesService from "~/composables/core/modules/accountTypes/accountTypes.service";

interface ResponseDTO {
  success: Boolean;
  data: any;
  errors: any;
}

export class AccountTypesModule implements BasicModuleInterface {
  private accountTypesService: AccountTypesService;

  constructor() {
    this.accountTypesService = new AccountTypesService();
  }

  async get(params: {} = {}):Promise<any> {
    return await this.accountTypesService.get(params);
  }
  async getById(id:any) {
    return await this.accountTypesService.get(id);
  }

  async post(data:object = {}):Promise<any> {
    return await this.accountTypesService.post(data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.accountTypesService.put(id, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.accountTypesService.patch(id, data);
  }

  async delete(id:any):Promise<any> {
    return await this.accountTypesService.delete(id);
  }


}

export default AccountTypesModule;
