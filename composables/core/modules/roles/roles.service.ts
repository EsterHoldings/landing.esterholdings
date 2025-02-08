import useApi from "~/composables/useApi";

export class RolesService {

  private useApi:any;
  constructor() {
    this.useApi = new useApi();
  }
  async get(params: {}):Promise<any> {
    return await this.useApi.get("/roles", params);
  }
  async getById(id:any) {
    return await this.useApi.get(`/roles/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    console.log('ROLES SERVICE POST', data);
    return await this.useApi.post("/roles", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/roles/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/roles/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/roles/${id}`);
  }
}

export default RolesService;