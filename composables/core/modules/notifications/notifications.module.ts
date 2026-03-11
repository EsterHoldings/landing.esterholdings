import NotificationsService from "~/composables/core/modules/notifications/notifications.service";

export class NotificationsModule {
  private notificationsService: NotificationsService;

  constructor() {
    this.notificationsService = new NotificationsService();
  }

  async get(params: object = {}): Promise<any> {
    return await this.notificationsService.get(params);
  }

  async getUnreadSummary(): Promise<any> {
    return await this.notificationsService.getUnreadSummary();
  }

  async markAllRead(): Promise<any> {
    return await this.notificationsService.markAllRead();
  }

  async markRead(notificationId: string): Promise<any> {
    return await this.notificationsService.markRead(notificationId);
  }
}

export default NotificationsModule;
