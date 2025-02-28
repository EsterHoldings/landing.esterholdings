import { useAuthStore } from "@/stores/authStore";
import { AuthModuleInterface, BasicModuleInterface } from "../module.interface";
import AuthService from "~/composables/core/modules/auth/auth.service";

import {
  COOKIE_STORAGE__ACCESS_TOKEN,
  COOKIE_STORAGE__REFRESH_TOKEN,
} from "~/constants/storage";
import {
  setItem as setItemToCookie,
  clearItem as clearItemToCookie,
} from "@/utils/storage/cookie";

interface ResponseDTO {
  success: Boolean;
  data: any;
  errors: any;
}

export class AuthModule implements BasicModuleInterface {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async userRegister(params: {}):Promise<any> {
    return await this.authService.userRegister("/users/register", params);
  }
  async userLogin(params: {}):Promise<any> {
    return await this.authService.userLogin("/users/login", params);
  }
  async userLogout(params: {}):Promise<any> {
    return await this.authService.userLogout("/users/logout", params);
  }
  async userForgotPass(params: {}):Promise<any> {
    return await this.authService.userForgotPass("/users/forgot_pass", params);
  }

  async adminLogin(params: {}):Promise<any> {
    return await this.authService.adminLogin(`/admins/login`, params);
  }
  async adminLogout():Promise<any> {
    return await this.authService.adminLogout(`/admins/logout`);
  }
}

export default AuthModule;
