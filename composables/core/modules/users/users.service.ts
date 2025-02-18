import useApi from "~/composables/useApi";

export class UsersService {

  private useApi:any;
  constructor() {
    this.useApi = new useApi();
  }
  async get(params: {}):Promise<any> {
    return await this.useApi.get("/users", params);
  }
  async getFirst(id:any):Promise<any> {
    return await this.useApi.get(`/users/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    return await this.useApi.post("/users", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/users/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/users/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/users/${id}/delete`);
  }
}

export default UsersService;