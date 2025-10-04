import useApi from "~/composables/useApi";

export class AccountTypesService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi(true);
  }

  async get(params: {}):Promise<any> {
    return await this.useApi.get("/client/account_types", params);
  }
  async getById(id:any) {
    return await this.useApi.get(`/client/account_types/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    console.log('ROLES SERVICE POST', data);
    return await this.useApi.post("/client/account_types", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/client/account_types/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/client/account_types/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/client/account_types/${id}`);
  }
}

export default AccountTypesService;
