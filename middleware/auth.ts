import { getItem as getItemFromCookieStorage } from "../utils/storage/cookie";
import {COOKIE_STORAGE__ACCESS_TOKEN} from "../constants/storage";

// @ts-ignore
export default defineNuxtRouteMiddleware(() => {
  if (!getItemFromCookieStorage(COOKIE_STORAGE__ACCESS_TOKEN))
      // @ts-ignore
    return navigateTo("/auth/login");
});
