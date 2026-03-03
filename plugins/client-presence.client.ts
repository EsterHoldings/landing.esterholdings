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

  const hasAccessToken = () => Boolean(String(authStore.accessToken ?? "").trim());

  const isEligibleRoute = () => {
    const path = String(route.path ?? "");
    if (!path) return false;

    return !path.includes("/auth/");
  };

  const isTabActive = () => {
    if (typeof document === "undefined" || typeof window === "undefined") return false;
    if (document.visibilityState !== "visible") return false;

    return document.hasFocus();
  };

  const shouldBeOnline = () => hasAccessToken() && isEligibleRoute() && isTabActive();

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
    if (shouldBeOnline()) {
      await ensureOnline();
      return;
    }

    stopHeartbeat();
    await leaveOnline();
  };

  const handleVisibilityOrFocus = () => {
    void syncPresenceState();
  };

  const handleBeforeUnload = () => {
    stopHeartbeat();
    void leaveOnline();
  };

  window.addEventListener("focus", handleVisibilityOrFocus);
  window.addEventListener("blur", handleVisibilityOrFocus);
  window.addEventListener("pageshow", handleVisibilityOrFocus);
  window.addEventListener("pagehide", handleBeforeUnload);
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityOrFocus);

  watch(
    () => [route.fullPath, authStore.accessToken] as const,
    () => {
      void syncPresenceState();
    },
    { immediate: true }
  );
});
