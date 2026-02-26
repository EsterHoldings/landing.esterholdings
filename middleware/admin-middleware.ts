import { useAdminAuthStore } from "../stores/adminAuthStore";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { ROUTE_ADMIN_AUTH_LOGIN } from "../constants/routes";
import { ADMIN_ACCESS_TOKEN } from "~/constants/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;

  const adminAuthStore = useAdminAuthStore();
  const localToken = localStorage.getItem(ADMIN_ACCESS_TOKEN) || localStorage.getItem("access_token");

  if (!adminAuthStore.isAuthenticated && localToken) {
    adminAuthStore.setAccessToken(localToken);
  }

  console.log("ADMIN MIDDLEWARE");

  if (!adminAuthStore.isAuthenticated) {
    return navigateTo(ROUTE_ADMIN_AUTH_LOGIN);
  }
});
