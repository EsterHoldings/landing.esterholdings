import {BasicModuleInterface} from "../module.interface";
import MessagesService from "~/composables/core/modules/messages/messages.service";

interface ResponseDTO {
  success: Boolean;
  data: any;
  errors: any;
}

export class MessagesModule implements BasicModuleInterface {
  private messagesService: MessagesService;

  constructor() {
    this.messagesService = new MessagesService();
  }

  async get(params: {} = {}):Promise<any> {
    return await this.messagesService.get(params);
  }
  async getById(id:any) {
    return await this.messagesService.get(id);
  }

  async post(data:object = {}):Promise<any> {
    return await this.messagesService.post(data);
  }

  async put(id:any, data:object = {}):Promise<any> {
    return await this.messagesService.put(id, data);
  }

  async patch(id:any, data:object = {}):Promise<any> {
    return await this.messagesService.patch(id, data);
  }

  async delete(id:any):Promise<any> {
    return await this.messagesService.delete(id);
  }


}

export default MessagesModule;
