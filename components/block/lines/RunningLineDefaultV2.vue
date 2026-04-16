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
        class="running-line-v2__card">
        <div class="running-line-v2__head">
          <UiIconTradeArrowUp
            v-if="item.isUp"
            class="running-line-v2__icon" />
          <UiIconTradeArrowDown
            v-else
            class="running-line-v2__icon" />
          <div class="running-line-v2__info">
            <p class="running-line-v2__symbol">{{ item.symbol }}</p>
            <p class="running-line-v2__price">{{ item.price }}</p>
          </div>
        </div>
        <button
          type="button"
          class="running-line-v2__btn">
          Trade
        </button>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
  import { useNuxtApp } from "nuxt/app";
  import UiIconTradeArrowDown from "~/components/ui/UiIconTradeArrowDown.vue";
  import UiIconTradeArrowUp from "~/components/ui/UiIconTradeArrowUp.vue";

  type TickerItem = {
    symbol: string;
    price: string;
    isUp: boolean;
  };

  type Mt4QuotePayload = {
    quotes?: Mt4Quote[];
    items?: Mt4Quote[];
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
    }>(),
    {
      speed: 0.5,
      live: true,
      channel: "mt4.quotes",
      event: "mt4.quotes.updated",
    }
  );

  const liveItems = ref<TickerItem[]>([]);
  const displayItems = computed(() => (liveItems.value.length > 0 ? liveItems.value : props.items));
  const duplicatedItems = computed(() => [...displayItems.value, ...displayItems.value]);
  const track = ref<HTMLElement | null>(null);
  const position = ref(0);
  let animationFrameId: number | null = null;
  let quotesChannel: any = null;

  const normalizeEventName = (event: string): string => (event.startsWith(".") ? event : `.${event}`);

  const toText = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    return String(value).trim();
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
    const price = toText(quote.price || quote.bid || quote.ask);
    const change = formatChange(quote.change);

    return change ? `${price} / ${change}` : price;
  };

  const quoteDirection = (quote: Mt4Quote): boolean => {
    if (typeof quote.is_up === "boolean") return quote.is_up;
    if (typeof quote.isUp === "boolean") return quote.isUp;

    const change = Number(toText(quote.change));

    return Number.isFinite(change) ? change >= 0 : true;
  };

  const applyQuotesPayload = (payload: Mt4QuotePayload) => {
    const quotes = Array.isArray(payload?.quotes) ? payload.quotes : Array.isArray(payload?.items) ? payload.items : [];
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
      liveItems.value = nextItems;
    }
  };

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

  const subscribeToLiveQuotes = () => {
    if (!props.live) return;

    const echo = (useNuxtApp() as any).$echo;
    if (!echo?.channel) return;

    quotesChannel = echo.channel(props.channel);
    quotesChannel.listen(normalizeEventName(props.event), applyQuotesPayload);
  };

  const unsubscribeFromLiveQuotes = () => {
    const echo = (useNuxtApp() as any).$echo;

    if (quotesChannel?.stopListening) {
      quotesChannel.stopListening(normalizeEventName(props.event));
    }

    if (echo?.leave) {
      echo.leave(props.channel);
    }

    quotesChannel = null;
  };

  watch(displayItems, resetPosition, { deep: true });

  onMounted(() => {
    subscribeToLiveQuotes();
    startAnimation();
  });

  onUnmounted(() => {
    unsubscribeFromLiveQuotes();
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
    }

    &__head {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    &__icon {
      flex-shrink: 0;
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
