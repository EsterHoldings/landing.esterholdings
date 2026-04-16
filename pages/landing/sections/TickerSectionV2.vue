<template>
  <section class="ticker-v2">
    <RunningLineDefaultV2 :items="items" />
  </section>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRuntimeConfig } from "nuxt/app";
  import RunningLineDefaultV2 from "~/components/block/lines/RunningLineDefaultV2.vue";

  const fallbackSymbols =
    "EURUSD,USDCHF,GBPUSD,USDJPY,USDCAD,AUDUSD,NZDUSD,EURGBP,EURJPY,EURCHF,EURAUD,EURCAD,EURNZD,GBPJPY,GBPCHF,GBPAUD,GBPCAD,GBPNZD,AUDJPY,AUDCHF,AUDCAD,AUDNZD,NZDJPY,NZDCHF,NZDCAD,CADJPY,CADCHF,CHFJPY,XAUUSD,XAGUSD";
  const runtimeConfig = useRuntimeConfig();

  const symbols = computed(() => {
    const configured = String(runtimeConfig.public?.mt4QuotesSymbols || fallbackSymbols);

    return Array.from(
      new Set(
        configured
          .split(",")
          .map(symbol => symbol.trim().toUpperCase())
          .filter(Boolean)
      )
    );
  });

  const items = computed(() => symbols.value.map(symbol => ({ symbol, price: "- / -", isUp: null })));
</script>

<style lang="scss" scoped>
  .ticker-v2 {
    overflow: hidden;
  }
</style>
