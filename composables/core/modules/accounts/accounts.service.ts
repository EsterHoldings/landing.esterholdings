import useApi from "~/composables/useApi";

export class AccountsService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi();
  }

  async get(params: {}):Promise<any> {
    return await this.useApi.get("/accounts", params);
  }
  async getById(id:any) {
    return await this.useApi.get(`/accounts/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    console.log('ROLES SERVICE POST', data);
    return await this.useApi.post("/accounts", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/accounts/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/accountw/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/accounts/${id}`);
  }
}

export default AccountsService;
