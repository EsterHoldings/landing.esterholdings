import Echo from "laravel-echo";
import type EchoType from "laravel-echo";
import Pusher from "pusher-js";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
import { ADMIN_ACCESS_TOKEN, USER_ACCESS_TOKEN } from "~/constants/auth";

declare global {
  interface Window {
    Pusher: any;
    Echo: EchoType<any>;
  }
}

const sanitizePort = (value: string | number | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const resolveOrigin = (candidate: string | undefined): string => {
  if (!candidate || candidate.trim() === "") {
    return window.location.origin;
  }

  try {
    const resolved = new URL(candidate, window.location.origin);
    return resolved.origin;
  } catch {
    return window.location.origin;
  }
};

const resolveAuthToken = (): string => {
  return (
    localStorage.getItem(ADMIN_ACCESS_TOKEN) ||
    localStorage.getItem("access_token") ||
    localStorage.getItem(USER_ACCESS_TOKEN) ||
    ""
  );
};

const resolveXsrfToken = (): string => {
  return document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? "";
};

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public as {
    hostBase?: string;
    baseApi?: string;
    reverbKey?: string;
    reverbHost?: string;
    reverbPort?: string | number;
    reverbScheme?: string;
  };

  const authOrigin = resolveOrigin(cfg.hostBase || cfg.baseApi);
  const authEndpoint = `${authOrigin}/broadcasting/auth`;

  const scheme = (cfg.reverbScheme || window.location.protocol.replace(":", "") || "http").toLowerCase();
  const forceTLS = scheme === "https";
  const port = sanitizePort(cfg.reverbPort, forceTLS ? 443 : 80);

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: "reverb",
    key: cfg.reverbKey,
    wsHost: cfg.reverbHost || window.location.hostname,
    wsPort: port,
    wssPort: port,
    forceTLS,
    enabledTransports: ["ws", "wss"],
    authEndpoint,
    withCredentials: true,
    authorizer: (channel: any) => ({
      authorize: async (socketId: string, callback: (error: boolean, data: any) => void) => {
        try {
          const token = resolveAuthToken();
          const xsrf = resolveXsrfToken();
          const response = await fetch(authEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              ...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            callback(true, errorBody || `Broadcast auth failed: ${response.status}`);
            return;
          }

          const data = await response.json();
          callback(false, data);
        } catch (error) {
          callback(true, error);
        }
      },
    }),
  });

  window.Echo = echo;

  return { provide: { echo } };
});
