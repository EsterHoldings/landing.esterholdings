import useAppCore from "~/composables/useAppCore";
import {ROUTE_AUTH_LOGIN} from "~/constants/routes";
import {defineStore} from "pinia";
import {navigateTo} from "nuxt/app";
import {ref, computed, watch} from "vue";
import {USER_ACCESS_TOKEN} from "~/constants/auth";

export const useAuthStore = defineStore("userAuth", () => {
    const accessToken = ref<string>("");
    const user = ref<any>(null);
    const photoUrl = ref<string>("");

    if (process.client) {
        const storedAccessToken = localStorage.getItem(USER_ACCESS_TOKEN);

        if (storedAccessToken) {
            accessToken.value = storedAccessToken;
        }
    }

    const isAuthenticated = computed<boolean>(() => {
        return accessToken.value !== "";
    });

    watch(accessToken, (newValue: string) => {
        if (process.client) {
            localStorage.setItem(USER_ACCESS_TOKEN, newValue);
        }
    });

    function setAccessToken(value: string): void {
        localStorage.setItem(USER_ACCESS_TOKEN, value);
        accessToken.value = value;
    }

    function setUser(userData: any): void {
        user.value = userData;
        photoUrl.value = userData.photo_url || "";
    }

    function setPhotoUrl(url: string): void {
        photoUrl.value = url;
    }

    async function initAuth(): Promise<void> {
        if (!process.client) {
            return;
        }
        if (!accessToken.value) {
            return;
        }

        const appCore = useAppCore();
        const response = await appCore.auth.getAuthUser();
        setUser(response.data);
    }

    async function authLogout(): Promise<void> {
        setAccessToken("");
        user.value = null;
        photoUrl.value = "";
        if (process.client) {
            localStorage.removeItem(USER_ACCESS_TOKEN);
        }
        navigateTo(ROUTE_AUTH_LOGIN);
    }

    return {
        accessToken,
        authLogout,
        initAuth,
        isAuthenticated,
        photoUrl,
        setAccessToken,
        setPhotoUrl,
        setUser,
        user,
    };
});
