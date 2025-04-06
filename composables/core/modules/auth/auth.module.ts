import AuthService from "~/composables/core/modules/auth/auth.service";

export class AuthModule {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async doRegister(params: {}):Promise<any> {
    return new Promise((res, rej) => res(true));
  }
  async doLogin(params: {}):Promise<any> {
    const response = await this.authService.postLogin(params);
    console.log('Response: ', response);
    console.log('Response data: ', response.data);
    // If status - 200
    // 1. Save accessToken and refreshToken
    return response;
  }
  async doLogout(params: {}):Promise<any> {
    return new Promise((res, rej) => res(true));
  }
  async doForgotPass(params: {}):Promise<any> {
    return new Promise((res, rej) => res(true));
  }
}
export default AuthModule;
