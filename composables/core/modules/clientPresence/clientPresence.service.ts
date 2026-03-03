import useApi from "~/composables/useApi";

export class ClientPresenceService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi(true);
  }

  async ping(params: Record<string, any> = {}): Promise<any> {
    return await this.useApi.post("/client/presence/ping", params);
  }

  async leave(params: Record<string, any> = {}): Promise<any> {
    return await this.useApi.delete("/client/presence", params);
  }
}

export default ClientPresenceService;
