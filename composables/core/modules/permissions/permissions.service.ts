import useApi from "~/composables/useApi";

export class PermissionsService {

  private useApi:any;
  constructor() {
    this.useApi = new useApi();
  }
  async get(params: {}):Promise<any> {
    return await this.useApi.get("/permissions", params);
  }
  async getFirst(id:any):Promise<any> {
    return await this.useApi.get(`/permissions/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    return await this.useApi.post("/permissions", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/permissions/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/permissions/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/permissions/${id}/delete`);
  }
}

export default PermissionsService;