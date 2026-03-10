import { defineNuxtPlugin, useRoute } from "#app";
import { watch } from "vue";
import useAppCore from "~/composables/useAppCore";
import { useAuthStore } from "~/stores/authStore";

const HEARTBEAT_INTERVAL_MS = 10_000;
const PRESENCE_TTL_SECONDS = 30;

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const appCore = useAppCore();
  const route = useRoute();

  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let isMarkedOnline = false;
  let inFlight = false;
  let supportModeResolved = false;
  let supportMode: "simple" | "full" = "simple";
  let supportModeResolvePromise: Promise<void> | null = null;

  const hasAccessToken = () => Boolean(String(authStore.accessToken ?? "").trim());

  const normalizeSupportMode = (value: unknown): "simple" | "full" => {
    return String(value ?? "simple")
      .trim()
      .toLowerCase() === "full"
      ? "full"
      : "simple";
  };

  const isEligibleRoute = () => {
    const path = String(route.path ?? "");
    if (!path) return false;

    return !path.includes("/auth/");
  };

  const isFullSupportEnabled = () => supportMode === "full";

  const isTabActive = () => {
    if (typeof document === "undefined") return false;
    return document.visibilityState === "visible";
  };

  const shouldBeOnline = () => hasAccessToken() && isFullSupportEnabled() && isEligibleRoute() && isTabActive();

  const resolveSupportMode = async () => {
    const storeSupportMode = authStore.user?.support_mode;
    if (typeof storeSupportMode === "string") {
      supportMode = normalizeSupportMode(storeSupportMode);
      supportModeResolved = true;
      return;
    }

    if (supportModeResolved) {
      return;
    }

    if (!hasAccessToken()) {
      supportMode = "simple";
      supportModeResolved = true;
      return;
    }

    if (supportModeResolvePromise) {
      await supportModeResolvePromise;
      return;
    }

    supportModeResolvePromise = (async () => {
      try {
        const response = await appCore.auth.getAuthUser();
        if (response?.data) {
          authStore.setUser(response.data);
          supportMode = normalizeSupportMode(response.data?.support_mode);
        } else {
          supportMode = "simple";
        }
      } catch {
        supportMode = "simple";
      } finally {
        supportModeResolved = true;
        supportModeResolvePromise = null;
      }
    })();

    await supportModeResolvePromise;
  };

  const stopHeartbeat = () => {
    if (!heartbeatTimer) return;
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  };

  const pingOnline = async () => {
    if (inFlight) return;
    inFlight = true;
    try {
      await appCore.clientPresence.ping({
        active: true,
        ttl_seconds: PRESENCE_TTL_SECONDS,
      });
      isMarkedOnline = true;
    } catch {
      // noop
    } finally {
      inFlight = false;
    }
  };

  const leaveOnline = async () => {
    if (!isMarkedOnline || inFlight) return;
    inFlight = true;
    try {
      await appCore.clientPresence.leave({
        active: false,
      });
    } catch {
      // noop
    } finally {
      isMarkedOnline = false;
      inFlight = false;
    }
  };

  const ensureOnline = async () => {
    if (!shouldBeOnline()) return;
    await pingOnline();

    if (!heartbeatTimer) {
      heartbeatTimer = setInterval(() => {
        if (!shouldBeOnline()) {
          stopHeartbeat();
          void leaveOnline();
          return;
        }

        void pingOnline();
      }, HEARTBEAT_INTERVAL_MS);
    }
  };

  const syncPresenceState = async () => {
    await resolveSupportMode();

    if (shouldBeOnline()) {
      await ensureOnline();
      return;
    }

    stopHeartbeat();
    await leaveOnline();
  };

  const handleVisibilityChange = () => {
    void syncPresenceState();
  };

  const handlePageShow = () => {
    void syncPresenceState();
  };

  const handleBrowserOnline = () => {
    void syncPresenceState();
  };

  const handleBeforeUnload = () => {
    stopHeartbeat();
    void leaveOnline();
  };

  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("online", handleBrowserOnline);
  window.addEventListener("pagehide", handleBeforeUnload);
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  watch(
    () => [route.fullPath, authStore.accessToken, authStore.user?.support_mode] as const,
    () => {
      const storeSupportMode = authStore.user?.support_mode;
      if (typeof storeSupportMode === "string") {
        supportMode = normalizeSupportMode(storeSupportMode);
        supportModeResolved = true;
      } else if (!hasAccessToken()) {
        supportMode = "simple";
        supportModeResolved = true;
      } else {
        supportModeResolved = false;
      }

      void syncPresenceState();
    },
    { immediate: true }
  );
});
