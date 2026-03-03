import ClientPresenceService from "~/composables/core/modules/clientPresence/clientPresence.service";

export class ClientPresenceModule {
  private clientPresenceService: ClientPresenceService;

  constructor() {
    this.clientPresenceService = new ClientPresenceService();
  }

  async ping(params: Record<string, any> = {}): Promise<any> {
    return await this.clientPresenceService.ping(params);
  }

  async leave(params: Record<string, any> = {}): Promise<any> {
    return await this.clientPresenceService.leave(params);
  }
}

export default ClientPresenceModule;
