import useApi from "~/composables/useApi";

export class AuthService {
  private useApi:any;

  constructor() {
    this.useApi = new useApi();
  }
  async get(params: {}):Promise<any> {
    return await this.useApi.get('/auth/user', params);
  }
  async postLogin(data:object = {}):Promise<any> {
    return await this.useApi.post('/auth/login', data);
  }
  async postLogout():Promise<any> {
    return await this.useApi.post('/auth/logout');
  }
}

export default AuthService;
