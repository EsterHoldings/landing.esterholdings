import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import useAppCore from "~/composables/useAppCore";

export const useAuthStore = defineStore('userAuth', () => {
  const accessToken = ref('');
  const refreshToken = ref('');

  if (process.client) {
    const storedAccessToken = localStorage.getItem('user_access_token');
    const storedRefreshToken = localStorage.getItem('user_refresh_token');

    if (storedAccessToken) {
      accessToken.value = storedAccessToken;
    }
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken;
    }
  }

  const isAuthenticated = computed(() => !!accessToken.value);

  watch(accessToken, (newValue) => {
    if (process.client) {
      localStorage.setItem('user_access_token', newValue);
    }
  });
  watch(refreshToken, (newValue) => {
    if (process.client) {
      localStorage.setItem('user_refresh_token', newValue);
    }
  });

  function setAccessToken(value: string) {
    accessToken.value = value;
  }

  function setRefreshToken(value: string) {
    refreshToken.value = value;
  }

  async function initAuth() {
    if (!process.client) return;
    if (!accessToken.value) return;

    const appCore = useAppCore();
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    setAccessToken,
    setRefreshToken,
    initAuth,
  };
});