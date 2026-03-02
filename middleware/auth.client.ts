import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const hasToken = !!localStorage.getItem("user_access_token");
  if (!hasToken) {
    const verifyEmailFlag = Array.isArray(to.query?.verify_email) ? to.query?.verify_email[0] : to.query?.verify_email;
    if (verifyEmailFlag === "1") {
      return navigateTo({
        path: "/auth/login",
        query: {
          return_to: to.fullPath,
        },
      });
    }

    return navigateTo("/auth/login");
  }
});
