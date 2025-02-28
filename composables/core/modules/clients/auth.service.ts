import useApi from "~/composables/useApi";

export class AuthService {
  private useApi: any;

  constructor() {
    this.useApi = new useApi();
  }

  async login(formData: Object): Promise<any> {
    return await this.useApi.post("/auth/login", formData);
  }

  async registration(formData: Object): Promise<any> {
    return await this.useApi.post("/auth/register", formData);
  }

  async logout(formData: Object): Promise<any> {
    return await this.useApi.post("/auth/logout");
  }
}

export default AuthService;
