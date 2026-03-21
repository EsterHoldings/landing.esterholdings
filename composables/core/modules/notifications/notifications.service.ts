import useApi from "~/composables/useApi";

export class NotificationsService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi(true);
  }

  async get(params: object = {}): Promise<any> {
    return await this.useApi.get("/client/notifications", params);
  }

  async getUnreadSummary(): Promise<any> {
    return await this.useApi.get("/client/notifications/unread-summary");
  }

  async markAllRead(): Promise<any> {
    return await this.useApi.post("/client/notifications/read-all");
  }

  async markReadByTypes(types: string[]): Promise<any> {
    return await this.useApi.post("/client/notifications/read-by-types", { types });
  }

  async markRead(notificationId: string): Promise<any> {
    return await this.useApi.post(`/client/notifications/${notificationId}/read`);
  }
}

export default NotificationsService;
