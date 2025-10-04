import useApi from "~/composables/useApi";

export class MessagesService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi(true);
  }

  async get(params: {}):Promise<any> {
    return await this.useApi.get("/client/messages", params);
  }

  async getById(id:any) {
    return await this.useApi.get(`/client/messages/${id}`);
  }

  async post(data:object = {}):Promise<any> {
    return await this.useApi.post("/client/messages", data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.useApi.put(`/client/messages/${id}`, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.useApi.patch(`/client/messages/${id}`, data);
  }

  async delete(id:any):Promise<any> {
    return await this.useApi.delete(`/client/messages/${id}`);
  }
}

export default MessagesService;
