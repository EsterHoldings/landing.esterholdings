import { useAuthStore } from "@/stores/authStore";
import {AuthModuleInterface, BasicModuleInterface} from "../module.interface";
import ClientsService from "~/composables/core/modules/auth/clients.service";

import {
  COOKIE_STORAGE__ACCESS_TOKEN,
  COOKIE_STORAGE__REFRESH_TOKEN,
} from "@/constans/storage";
import {
  setItem as setItemToCookie,
  clearItem as clearItemToCookie,
} from "@/utils/storage/cookie";

interface ResponseDTO {
  success: Boolean;
  data: any;
  errors: any;
}

export class AuthModule implements AuthModuleInterface {
  private authService: ClientsService;
  private authStore: any;

  constructor() {
    this.authStore = useAuthStore();
    this.authService = new ClientsService();
  }

  getStore(): any {
    return this.authStore;
  }

  doLogin(data: any): BasicModuleInterface {
    return undefined;
  }

  doLogout(): BasicModuleInterface {
    return undefined;
  }

  doRegistration(data: any): BasicModuleInterface {
    return undefined;
  }

  // async doRegistration(formData: any) {
  //   await this.authService.registration(formData);
  // }
  //
  // async doLogin(formData: any) {
  //   const response = await this.authService.login(formData);
  //   setItemToCookie(
  //     COOKIE_STORAGE__ACCESS_TOKEN,
  //     response.data.data.accessToken
  //   );
  //   this.authStore.setAccessToken(response.data.data.accessToken);
  // }
  //
  // async doLogout() {
  //   // TODO :: Do logout on backend side
  //   clearItemToCookie(COOKIE_STORAGE__ACCESS_TOKEN);
  //   clearItemToCookie(COOKIE_STORAGE__REFRESH_TOKEN);
  //   this.authStore.setAccessToken("");
  //   this.authStore.setRefreshToken("");
  // }
}

export default AuthModule;
