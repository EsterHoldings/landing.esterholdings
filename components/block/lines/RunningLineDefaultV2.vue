<template>
  <div
    class="running-line-v2"
    @mouseenter="stopAnimation"
    @mouseleave="startAnimation">
    <div
      ref="track"
      class="running-line-v2__track">
      <article
        v-for="(item, index) in duplicatedItems"
        :key="`${item.symbol}-${item.price}-${index}`"
        class="running-line-v2__card"
        :class="cardClasses(item)">
        <div class="running-line-v2__head">
          <UiIconTradeArrowUp
            v-if="item.isUp === true"
            class="running-line-v2__icon" />
          <UiIconTradeArrowDown
            v-else-if="item.isUp === false"
            class="running-line-v2__icon" />
          <span
            v-else
            class="running-line-v2__icon running-line-v2__icon--empty"
            aria-hidden="true">
            -
          </span>
          <div class="running-line-v2__info">
            <p class="running-line-v2__symbol">{{ item.symbol }}</p>
            <p class="running-line-v2__price">{{ item.price }}</p>
          </div>
        </div>
        <a
          :href="tradeHref"
          class="running-line-v2__btn">
          Trade
        </a>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Pusher from "pusher-js";
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
  import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
  import UiIconTradeArrowDown from "~/components/ui/UiIconTradeArrowDown.vue";
  import UiIconTradeArrowUp from "~/components/ui/UiIconTradeArrowUp.vue";
  import { useCabinetLink } from "~/composables/useCabinetLink";

  type TickerItem = {
    symbol: string;
    price: string;
    isUp: boolean | null;
  };

  type Mt4QuotePayload = {
    quotes?: Mt4Quote[];
    items?: Mt4Quote[];
    data?: Mt4QuotePayload | string;
    sequence?: unknown;
  };

  type Mt4Quote = {
    symbol?: unknown;
    price?: unknown;
    bid?: unknown;
    ask?: unknown;
    change?: unknown;
    is_up?: unknown;
    isUp?: unknown;
  };

  const props = withDefaults(
    defineProps<{
      items: TickerItem[];
      speed?: number;
      live?: boolean;
      channel?: string;
      event?: string;
      tradeHref?: string;
    }>(),
    {
      speed: 0.5,
      live: true,
      channel: "mt4.quotes",
      event: "mt4.quotes.updated",
      tradeHref: "",
    }
  );

  const runtimeConfig = useRuntimeConfig();
  const { cabinetLink } = useCabinetLink();
  const liveItems = ref<TickerItem[]>([]);
  const highlightedSymbols = ref<Set<string>>(new Set());
  const highlightDirections = ref<Record<string, "up" | "down">>({});
  const displayItems = computed(() => (liveItems.value.length > 0 ? liveItems.value : props.items));
  const duplicatedItems = computed(() => [...displayItems.value, ...displayItems.value]);
  const tradeHref = computed(() => props.tradeHref || cabinetLink("/auth/login"));
  const track = ref<HTMLElement | null>(null);
  const position = ref(0);
  let animationFrameId: number | null = null;
  let quotesChannel: any = null;
  let quotesPusher: any = null;
  let ownsQuotesPusher = false;
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let staleQuotesTimer: ReturnType<typeof setTimeout> | null = null;
  let latestQuotesPollTimer: ReturnType<typeof setInterval> | null = null;
  let quotesGlobalHandler: ((eventName: string, payload: unknown) => void) | null = null;
  let debugQuotes = false;

  const normalizePusherEventName = (event: string): string => event.replace(/^\./, "");
  const quoteEventNames = (event: string): string[] => {
    const normalized = normalizePusherEventName(event);

    return Array.from(new Set([normalized, `.${normalized}`]));
  };

  const toText = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    return String(value).trim();
  };

  const isLoopbackHost = (value: string): boolean => {
    const normalized = value.trim().toLowerCase();

    return normalized === "localhost" || normalized === "127.0.0.1";
  };

  const hostFromUrl = (value: unknown): string => {
    const raw = toText(value);
    if (!raw) return "";

    try {
      return new URL(raw, window.location.origin).hostname;
    } catch {
      return "";
    }
  };

  const apiUrl = (path: string): string => {
    const publicConfig = runtimeConfig.public || {};
    const configuredUrl = toText(publicConfig.mt4QuotesLatestUrl);
    if (configuredUrl) {
      return new URL(configuredUrl, window.location.origin).toString();
    }

    const apiBase =
      toText(publicConfig.apiBase) || toText(publicConfig.baseApi) || "https://server.esterholdings.com/api";

    return `${apiBase.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };

  const parsePayload = (payload: unknown): Mt4QuotePayload => {
    if (typeof payload === "string") {
      try {
        return parsePayload(JSON.parse(payload));
      } catch {
        return {};
      }
    }

    if (payload && typeof payload === "object") {
      const value = payload as Mt4QuotePayload;

      if (!Array.isArray(value.quotes) && !Array.isArray(value.items) && value.data) {
        return parsePayload(value.data);
      }

      return value;
    }

    return {};
  };

  const quoteDebugEnabled = (): boolean => {
    if (typeof window === "undefined") return false;

    return (
      new URLSearchParams(window.location.search).has("quotesDebug") || localStorage.getItem("mt4QuotesDebug") === "1"
    );
  };

  const logQuoteDebug = (...args: unknown[]) => {
    if (!debugQuotes) return;

    console.info("[mt4-quotes]", ...args);
  };

  const formatChange = (value: unknown): string => {
    const change = toText(value);
    if (change === "") return "";

    const numericChange = Number(change);
    if (!Number.isFinite(numericChange) || numericChange <= 0 || change.startsWith("+")) {
      return change;
    }

    return `+${change}`;
  };

  const quotePrice = (quote: Mt4Quote): string => {
    const price = toText(quote.price ?? quote.bid ?? quote.ask);
    const change = formatChange(quote.change);

    return change ? `${price} / ${change}` : price;
  };

  const quoteDirection = (quote: Mt4Quote): boolean => {
    if (typeof quote.is_up === "boolean") return quote.is_up;
    if (typeof quote.isUp === "boolean") return quote.isUp;

    const change = Number(toText(quote.change));

    return Number.isFinite(change) ? change >= 0 : true;
  };

  const applyQuotesPayload = (rawPayload: Mt4QuotePayload | unknown) => {
    const payload = parsePayload(rawPayload);
    const quotes = Array.isArray(payload?.quotes) ? payload.quotes : Array.isArray(payload?.items) ? payload.items : [];
    const previousBySymbol = new Map(displayItems.value.map(item => [item.symbol, item.price]));
    const nextItems = quotes
      .map((quote): TickerItem | null => {
        const symbol = toText(quote.symbol);
        const price = quotePrice(quote);
        if (!symbol || !price) return null;

        return {
          symbol,
          price,
          isUp: quoteDirection(quote),
        };
      })
      .filter((item): item is TickerItem => item !== null);

    if (nextItems.length > 0) {
      logQuoteDebug("received", {
        sequence: payload.sequence,
        count: nextItems.length,
        sample: nextItems.slice(0, 3),
      });

      const changedSymbols = new Set<string>();
      const directions: Record<string, "up" | "down"> = {};
      nextItems.forEach(item => {
        if (previousBySymbol.get(item.symbol) !== item.price) {
          changedSymbols.add(item.symbol);
          directions[item.symbol] = item.isUp === false ? "down" : "up";
        }
      });

      liveItems.value = nextItems;
      scheduleStaleQuotesReset();

      if (changedSymbols.size > 0) {
        highlightedSymbols.value = changedSymbols;
        highlightDirections.value = directions;

        if (highlightTimer) {
          clearTimeout(highlightTimer);
        }

        highlightTimer = setTimeout(() => {
          highlightedSymbols.value = new Set();
          highlightDirections.value = {};
          highlightTimer = null;
        }, 1800);
      }
    }
  };

  const scheduleStaleQuotesReset = () => {
    if (staleQuotesTimer) {
      clearTimeout(staleQuotesTimer);
    }

    staleQuotesTimer = setTimeout(() => {
      liveItems.value = [];
      highlightedSymbols.value = new Set();
      highlightDirections.value = {};
      staleQuotesTimer = null;
      logQuoteDebug("stale live quotes cleared");
    }, 15000);
  };

  const fetchLatestQuotes = async () => {
    if (!props.live || typeof window === "undefined") return;

    try {
      const response = await fetch(apiUrl("/mt4/quotes/latest"), {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        logQuoteDebug("latest snapshot unavailable", response.status);
        return;
      }

      applyQuotesPayload(await response.json());
    } catch (error) {
      logQuoteDebug("latest snapshot fetch error", error);
    }
  };

  const resolveLatestPollInterval = (): number => {
    const configured = Number(toText(runtimeConfig.public?.mt4QuotesFallbackIntervalMs));

    return Number.isFinite(configured) && configured > 0 ? Math.max(1000, configured) : 3000;
  };

  const startLatestQuotesPolling = () => {
    if (!props.live || latestQuotesPollTimer) return;

    void fetchLatestQuotes();
    latestQuotesPollTimer = setInterval(() => {
      void fetchLatestQuotes();
    }, resolveLatestPollInterval());
  };

  const stopLatestQuotesPolling = () => {
    if (!latestQuotesPollTimer) return;

    clearInterval(latestQuotesPollTimer);
    latestQuotesPollTimer = null;
  };

  const cardClasses = (item: TickerItem) => ({
    "running-line-v2__card--changed": highlightedSymbols.value.has(item.symbol),
    "running-line-v2__card--changed-up":
      highlightedSymbols.value.has(item.symbol) && highlightDirections.value[item.symbol] === "up",
    "running-line-v2__card--changed-down":
      highlightedSymbols.value.has(item.symbol) && highlightDirections.value[item.symbol] === "down",
  });

  const resetPosition = () => {
    position.value = 0;
    nextTick(() => {
      if (track.value) {
        track.value.style.transform = "translateX(0px)";
      }
    });
  };

  const animate = () => {
    if (!track.value) return;
    const halfWidth = track.value.scrollWidth / 2;
    if (halfWidth <= 0) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    position.value -= props.speed;
    if (Math.abs(position.value) >= halfWidth) {
      position.value = 0;
    }
    track.value.style.transform = `translateX(${position.value}px)`;
    animationFrameId = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (!animationFrameId) animate();
  };

  const stopAnimation = () => {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  const resolveQuoteSocketConfig = () => {
    const publicConfig = runtimeConfig.public || {};
    const currentHost = window.location.hostname;
    const fallbackHost =
      hostFromUrl(publicConfig.hostBase) || hostFromUrl(publicConfig.baseUrl) || "server.esterholdings.com";
    const configuredHost = toText(publicConfig.reverbHost);
    const host =
      configuredHost && (!isLoopbackHost(configuredHost) || isLoopbackHost(currentHost))
        ? configuredHost
        : fallbackHost || currentHost;
    const runtimeScheme = toText(publicConfig.reverbScheme).toLowerCase();
    const currentScheme = window.location.protocol.replace(":", "").toLowerCase();
    const scheme =
      currentScheme === "https" && runtimeScheme !== "https" ? "https" : runtimeScheme || currentScheme || "http";
    const forceTLS = scheme === "https";
    const port = Number(publicConfig.reverbPort) || (forceTLS ? 443 : 80);

    return {
      key: toText(publicConfig.reverbKey) || "prod-key",
      cluster: toText(publicConfig.reverbCluster) || "mt1",
      host,
      port,
      forceTLS,
      transport: forceTLS ? "wss" : "ws",
    };
  };

  const bindQuotesChannel = (pusher: any) => {
    const eventName = normalizePusherEventName(props.event);
    const eventNames = quoteEventNames(props.event);
    quotesChannel = pusher.subscribe(props.channel);
    eventNames.forEach(name => {
      quotesChannel.bind(name, applyQuotesPayload);
    });
    if (quotesChannel.bind_global) {
      quotesGlobalHandler = (incomingEventName: string, payload: unknown) => {
        const normalizedIncomingEventName = normalizePusherEventName(incomingEventName);
        if (normalizedIncomingEventName === eventName) {
          applyQuotesPayload(payload);
        }
      };
      quotesChannel.bind_global(quotesGlobalHandler);
    }
    quotesChannel.bind("pusher:subscription_succeeded", () => {
      logQuoteDebug("subscribed", { channel: props.channel, events: eventNames });
    });
    quotesChannel.bind("pusher:subscription_error", (error: unknown) => {
      logQuoteDebug("subscription_error", error);
    });
  };

  const subscribeToLiveQuotes = () => {
    if (!props.live) return;
    debugQuotes = quoteDebugEnabled();

    const echo = (useNuxtApp() as any).$echo || (window as any).Echo;
    const sharedPusher = echo?.connector?.pusher;

    if (sharedPusher?.subscribe) {
      quotesPusher = sharedPusher;
      ownsQuotesPusher = false;
      bindQuotesChannel(sharedPusher);
      logQuoteDebug("using shared Echo pusher");
      return;
    }

    const socketConfig = resolveQuoteSocketConfig();
    quotesPusher = new Pusher(socketConfig.key, {
      cluster: socketConfig.cluster,
      wsHost: socketConfig.host,
      wsPort: socketConfig.port,
      wssPort: socketConfig.port,
      forceTLS: socketConfig.forceTLS,
      enabledTransports: [socketConfig.transport],
      enableStats: false,
    });
    ownsQuotesPusher = true;
    quotesPusher.connection.bind("state_change", (state: unknown) => logQuoteDebug("state", state));
    quotesPusher.connection.bind("error", (error: unknown) => logQuoteDebug("connection_error", error));
    bindQuotesChannel(quotesPusher);
    logQuoteDebug("using direct pusher", socketConfig);
  };

  const unsubscribeFromLiveQuotes = () => {
    const eventNames = quoteEventNames(props.event);

    if (quotesChannel?.unbind) {
      eventNames.forEach(name => {
        quotesChannel.unbind(name, applyQuotesPayload);
      });
    }

    if (quotesChannel?.unbind_global && quotesGlobalHandler) {
      quotesChannel.unbind_global(quotesGlobalHandler);
    }

    if (quotesPusher?.unsubscribe) {
      quotesPusher.unsubscribe(props.channel);
    }

    if (ownsQuotesPusher && quotesPusher?.disconnect) {
      quotesPusher.disconnect();
    }

    quotesChannel = null;
    quotesPusher = null;
    ownsQuotesPusher = false;
    quotesGlobalHandler = null;
  };

  watch(() => displayItems.value.length, resetPosition);

  onMounted(() => {
    debugQuotes = quoteDebugEnabled();
    startLatestQuotesPolling();
    subscribeToLiveQuotes();
    startAnimation();
  });

  onUnmounted(() => {
    if (highlightTimer) {
      clearTimeout(highlightTimer);
    }

    if (staleQuotesTimer) {
      clearTimeout(staleQuotesTimer);
    }

    unsubscribeFromLiveQuotes();
    stopLatestQuotesPolling();
    stopAnimation();
  });
</script>

<style scoped lang="scss">
  .running-line-v2 {
    overflow: hidden;
    margin-top: 14px;

    &__track {
      display: flex;
      width: max-content;
      gap: 18px;
      transition: transform 0.1s linear;
      will-change: transform;
    }

    &__card {
      border-radius: 20px;
      border: 1px solid var(--landing-border-strong);
      background: var(--landing-surface-glass);
      backdrop-filter: blur(10px);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 40px;
      flex-shrink: 0;
      transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        background 0.25s ease,
        transform 0.25s ease;
    }

    &__card--changed {
      transform: translateY(-2px);
      animation: quote-card-pulse 1.8s ease both;
    }

    &__card--changed-up {
      border-color: rgba(77, 199, 97, 0.72);
      box-shadow: 0 16px 38px rgba(77, 199, 97, 0.2);
      background: linear-gradient(0deg, rgba(77, 199, 97, 0.14), rgba(77, 199, 97, 0.14)), var(--landing-surface-glass);
    }

    &__card--changed-down {
      border-color: rgba(255, 91, 91, 0.7);
      box-shadow: 0 16px 38px rgba(255, 91, 91, 0.18);
      background: linear-gradient(0deg, rgba(255, 91, 91, 0.13), rgba(255, 91, 91, 0.13)), var(--landing-surface-glass);
    }

    &__head {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    &__icon {
      flex-shrink: 0;
    }

    &__icon--empty {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(148, 163, 184, 0.16);
      color: var(--landing-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: "DM Sans", sans-serif;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__symbol {
      margin: 0;
      color: var(--landing-text-primary);
      font-family: "DM Sans", sans-serif;
      font-size: 18px;
      line-height: 1.302;
      font-weight: 700;
    }

    &__price {
      margin: 0;
      color: var(--landing-text-primary);
      font-family: "DM Sans", sans-serif;
      font-size: 14px;
      line-height: 1.302;
    }

    &__btn {
      height: 42px;
      padding: 10px 16px;
      border: 0;
      border-radius: 12px;
      background: var(--landing-accent);
      color: var(--landing-on-accent);
      font-family: "DM Sans", sans-serif;
      font-size: 16px;
      line-height: 1.302;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }

    &__btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 26px rgba(0, 81, 255, 0.24);
    }
  }

  @keyframes quote-card-pulse {
    0% {
      filter: brightness(1);
    }

    18% {
      filter: brightness(1.08);
    }

    100% {
      filter: brightness(1);
    }
  }

  @media (max-width: 991px) {
    .running-line-v2 {
      margin-top: 12px;

      &__track {
        gap: 10px;
      }

      &__card {
        padding: 10px 14px;
        gap: 14px;
        border-radius: 14px;
      }

      &__head {
        gap: 8px;
      }

      &__icon {
        width: 32px;
        height: 32px;
      }

      &__symbol {
        font-size: 13px;
      }

      &__price {
        font-size: 11px;
      }

      &__btn {
        height: 32px;
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 8px;
      }
    }
  }
</style>
