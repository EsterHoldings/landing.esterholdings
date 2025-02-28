import useApi from "~/composables/useApi";

export class AuthService {
  private useApi:any;
  constructor() {
    this.useApi = new useApi();
  }
  async userRegister(params: {}):Promise<any> {
    return await this.useApi.post("/users/register", params);
  }
  async userLogin(params: {}):Promise<any> {
    return await this.useApi.post("/users/login", params);
  }
  async userLogout(params: {}):Promise<any> {
    return await this.useApi.post("/users/logout", params);
  }
  async userForgotPass(params: {}):Promise<any> {
    return await this.useApi.post("/users/forgot_pass", params);
  }

  async adminLogin(params: {}):Promise<any> {
    return await this.useApi.post(`/admins/login`, params);
  }
  async adminLogout():Promise<any> {
    return await this.useApi.post(`/admins/logout`);
  }
}

export default AuthService;
