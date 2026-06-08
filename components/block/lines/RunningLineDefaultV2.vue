<template>
  <div
    ref="viewport"
    class="running-line-v2"
    :class="{ 'running-line-v2--dragging': isDragging }"
    @scroll.passive="handleScroll"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
    @click.capture="handleClickCapture"
    @mouseenter="stopAnimation"
    @mouseleave="startAnimation">
    <div
      ref="track"
      class="running-line-v2__track">
      <article
        v-for="loopItem in loopItems"
        :key="`${loopItem.copy}-${loopItem.item.symbol}`"
        v-memo="[loopItem.copy, loopItem.item.symbol, loopItem.item.price, loopItem.item.isUp, tradeHref]"
        class="running-line-v2__card">
        <div class="running-line-v2__head">
          <UiIconTradeArrowUp
            v-if="loopItem.item.isUp === true"
            class="running-line-v2__icon" />
          <UiIconTradeArrowDown
            v-else-if="loopItem.item.isUp === false"
            class="running-line-v2__icon" />
          <span
            v-else
            class="running-line-v2__icon running-line-v2__icon--empty"
            aria-hidden="true">
            -
          </span>
          <div class="running-line-v2__info">
            <p class="running-line-v2__symbol">{{ loopItem.item.symbol }}</p>
            <RunningQuotePrice
              v-if="loopItem.copy === 1"
              class="running-line-v2__price"
              :direction="priceDirection(loopItem.item)"
              :value="loopItem.item.price" />
            <p
              v-else
              class="running-line-v2__price running-line-v2__price--static">
              {{ loopItem.item.price }}
            </p>
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
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";
  import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
  import RunningQuotePrice from "~/components/block/lines/RunningQuotePrice.vue";
  import UiIconTradeArrowDown from "~/components/ui/UiIconTradeArrowDown.vue";
  import UiIconTradeArrowUp from "~/components/ui/UiIconTradeArrowUp.vue";
  import { useInfiniteHorizontalLoop } from "~/composables/useInfiniteHorizontalLoop";
  import { useCabinetLink } from "~/composables/useCabinetLink";

  type QuoteDirection = "up" | "down" | null;

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
  const QUOTE_FLUSH_BATCH_SIZE = 1;
  const { cabinetLink } = useCabinetLink();
  const liveQuoteMap = ref<Record<string, TickerItem>>({});
  const liveQuoteOrder = ref<string[]>([]);
  const tradeHref = computed(() => props.tradeHref || cabinetLink("/auth/login"));
  const viewport = ref<HTMLElement | null>(null);
  const track = ref<HTMLElement | null>(null);
  const {
    copies,
    isDragging,
    resetLoopPosition,
    startAnimation,
    stopAnimation,
    handleScroll,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleClickCapture,
  } = useInfiniteHorizontalLoop(viewport, track, { speed: props.speed });
  let quotesChannel: any = null;
  let quotesPusher: any = null;
  let ownsQuotesPusher = false;
  let staleQuotesTimer: ReturnType<typeof setTimeout> | null = null;
  let latestQuotesPollTimer: ReturnType<typeof setInterval> | null = null;
  let quotesGlobalHandler: ((eventName: string, payload: unknown) => void) | null = null;
  let pendingQuoteItems = new Map<string, TickerItem>();
  let quoteFlushFrame: number | null = null;
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

  const normalizeQuoteSymbol = (value: unknown): string => toText(value).replace(/!+$/, "").toUpperCase();

  const baseItemMap = computed(() => {
    const map = new Map<string, TickerItem>();
    props.items.forEach(item => {
      map.set(normalizeQuoteSymbol(item.symbol), item);
    });

    return map;
  });
  const baseSymbols = computed(() => new Set(baseItemMap.value.keys()));
  const displayItems = computed(() => {
    const quoteMap = liveQuoteMap.value;
    const baseItems = props.items.map(item => {
      const symbol = normalizeQuoteSymbol(item.symbol);

      return quoteMap[symbol] ?? item;
    });
    const extraItems = liveQuoteOrder.value
      .filter(symbol => !baseSymbols.value.has(symbol))
      .map(symbol => quoteMap[symbol])
      .filter((item): item is TickerItem => Boolean(item));

    return [...baseItems, ...extraItems];
  });
  const loopItems = computed(() =>
    Array.from({ length: copies }, (_, copy) => displayItems.value.map(item => ({ copy, item }))).flat()
  );

  const quotePrecision = (symbol: string, value: string): number => {
    const rawFractionLength = value.includes(".") ? value.slice(value.indexOf(".") + 1).length : 0;
    const normalizedSymbol = normalizeQuoteSymbol(symbol);
    let preferredPrecision = 5;

    if (normalizedSymbol.includes("JPY")) {
      preferredPrecision = 3;
    } else if (normalizedSymbol.startsWith("XAU")) {
      preferredPrecision = 2;
    } else if (normalizedSymbol.startsWith("XAG")) {
      preferredPrecision = 3;
    } else if (Number(value) >= 100) {
      preferredPrecision = 3;
    }

    return Math.min(8, Math.max(preferredPrecision, rawFractionLength));
  };

  const formatQuoteNumber = (value: unknown, symbol: string): string => {
    const raw = toText(value);
    if (raw === "") return "";

    const normalized = raw.replace(/\s+/g, "");
    const number = Number(normalized);
    if (!Number.isFinite(number)) return raw;

    return number.toFixed(quotePrecision(symbol, normalized));
  };

  const quotePrice = (quote: Mt4Quote): string => {
    const symbol = normalizeQuoteSymbol(quote.symbol);
    const bid = formatQuoteNumber(quote.bid, symbol);
    const ask = formatQuoteNumber(quote.ask, symbol);

    if (bid && ask) {
      return `${bid} / ${ask}`;
    }

    const price = formatQuoteNumber(quote.price ?? quote.bid ?? quote.ask, symbol);
    const change = formatChange(quote.change);

    return change ? `${price} / ${change}` : price;
  };

  const quoteDirection = (quote: Mt4Quote): boolean => {
    if (typeof quote.is_up === "boolean") return quote.is_up;
    if (typeof quote.isUp === "boolean") return quote.isUp;

    const change = Number(toText(quote.change));

    return Number.isFinite(change) ? change >= 0 : true;
  };

  const quoteChanged = (item: TickerItem): boolean => {
    const previous = liveQuoteMap.value[item.symbol] ?? baseItemMap.value.get(item.symbol);

    return !previous || previous.price !== item.price || previous.isUp !== item.isUp;
  };

  const scheduleQuoteFlush = () => {
    if (quoteFlushFrame !== null) return;

    quoteFlushFrame = requestAnimationFrame(flushPendingQuotes);
  };

  function flushPendingQuotes() {
    quoteFlushFrame = null;

    const entries = Array.from(pendingQuoteItems.entries()).slice(0, QUOTE_FLUSH_BATCH_SIZE);
    if (entries.length === 0) return;

    entries.forEach(([symbol]) => {
      pendingQuoteItems.delete(symbol);
    });

    const nextQuoteMap = { ...liveQuoteMap.value };
    const nextQuoteOrder = [...liveQuoteOrder.value];
    const nextQuoteSymbols = new Set(nextQuoteOrder);

    entries.forEach(([symbol, item]) => {
      nextQuoteMap[symbol] = item;

      if (!nextQuoteSymbols.has(symbol)) {
        nextQuoteOrder.push(symbol);
        nextQuoteSymbols.add(symbol);
      }
    });

    liveQuoteMap.value = nextQuoteMap;
    liveQuoteOrder.value = nextQuoteOrder;

    if (pendingQuoteItems.size > 0) {
      scheduleQuoteFlush();
    }
  }

  const applyQuotesPayload = (rawPayload: Mt4QuotePayload | unknown) => {
    const payload = parsePayload(rawPayload);
    const quotes = Array.isArray(payload?.quotes) ? payload.quotes : Array.isArray(payload?.items) ? payload.items : [];
    const nextItems = quotes
      .map((quote): TickerItem | null => {
        const symbol = normalizeQuoteSymbol(quote.symbol);
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

      nextItems.forEach(item => {
        if (quoteChanged(item)) {
          pendingQuoteItems.set(item.symbol, item);
        }
      });

      if (pendingQuoteItems.size > 0) {
        scheduleQuoteFlush();
      }

      scheduleStaleQuotesReset();
    }
  };

  const scheduleStaleQuotesReset = () => {
    if (staleQuotesTimer) {
      clearTimeout(staleQuotesTimer);
    }

    staleQuotesTimer = setTimeout(() => {
      pendingQuoteItems.clear();
      if (quoteFlushFrame !== null) {
        cancelAnimationFrame(quoteFlushFrame);
        quoteFlushFrame = null;
      }
      liveQuoteMap.value = {};
      liveQuoteOrder.value = [];
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

  const resolveLatestPollInterval = (): number | null => {
    const configuredRaw = toText(runtimeConfig.public?.mt4QuotesFallbackIntervalMs);
    if (configuredRaw === "") return null;

    const configured = Number(configuredRaw);

    return Number.isFinite(configured) && configured > 0 ? Math.max(1000, configured) : null;
  };

  const startLatestQuotesSnapshot = () => {
    if (!props.live || latestQuotesPollTimer) return;

    void fetchLatestQuotes();
  };

  const startLatestQuotesPolling = () => {
    if (!props.live || latestQuotesPollTimer) return;

    const interval = resolveLatestPollInterval();
    if (interval === null) {
      startLatestQuotesSnapshot();
      return;
    }

    void fetchLatestQuotes();
    latestQuotesPollTimer = setInterval(() => {
      void fetchLatestQuotes();
    }, interval);
  };

  const stopLatestQuotesPolling = () => {
    if (!latestQuotesPollTimer) return;

    clearInterval(latestQuotesPollTimer);
    latestQuotesPollTimer = null;
  };

  const priceDirection = (item: TickerItem): QuoteDirection => {
    if (item.isUp === true) return "up";
    if (item.isUp === false) return "down";

    return null;
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
      transport: "ws",
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

  const subscribeToLiveQuotes = async () => {
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
    const { default: Pusher } = await import("pusher-js");

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

  watch(() => displayItems.value.length, () => resetLoopPosition());

  onMounted(() => {
    debugQuotes = quoteDebugEnabled();
    void subscribeToLiveQuotes();
    startLatestQuotesPolling();
    resetLoopPosition();
    window.setTimeout(() => resetLoopPosition(), 150);
    startAnimation();
  });

  onUnmounted(() => {
    if (staleQuotesTimer) {
      clearTimeout(staleQuotesTimer);
    }

    pendingQuoteItems.clear();
    if (quoteFlushFrame !== null) {
      cancelAnimationFrame(quoteFlushFrame);
      quoteFlushFrame = null;
    }

    unsubscribeFromLiveQuotes();
    stopLatestQuotesPolling();
    stopAnimation();
  });
</script>

<style scoped lang="scss">
  .running-line-v2 {
    overflow-x: hidden;
    overflow-y: hidden;
    margin-top: 14px;
    cursor: grab;
    overscroll-behavior-x: contain;
    scroll-behavior: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &--dragging {
      cursor: grabbing;
    }

    &__track {
      display: flex;
      width: max-content;
      gap: 18px;
      will-change: transform;
    }

    &__card {
      box-sizing: border-box;
      border-radius: 20px;
      border: 0;
      background: var(--landing-surface-glass);
      backdrop-filter: blur(10px);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 40px;
      flex-shrink: 0;
      user-select: none;
      transition: background 0.2s ease;
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
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum" 1;
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
