<script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";

  import PanelDefault from "~/components/block/panels/PanelDefault.vue";
  import UiTextSmall from "~/components/ui/UiTextSmall.vue";
  import UiTextH3 from "~/components/ui/UiTextH3.vue";

  const props = withDefaults(
    defineProps<{
      amount: number;
      currency?: string;
      isLoading?: boolean;
    }>(),
    {
      currency: "USD",
      isLoading: false,
    }
  );

  const { t } = useI18n({ useScope: "global" });
  const resolveText = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
  const title = computed(() => resolveText("cabinet.dashboard.summary.referralTotalAmount", "Referral total amount"));

  const formattedAmount = computed(() => {
    if (props.isLoading) return " ";

    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: props.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(props.amount ?? 0));
    } catch {
      return `${props.currency} ${Number(props.amount ?? 0).toFixed(2)}`;
    }
  });
</script>

<template>
  <PanelDefault class="relative h-full min-h-[72px] p-2.5 sm:min-h-[88px] sm:p-3.5">
    <div class="summary-widget">
      <template v-if="props.isLoading">
        <span class="summary-skeleton summary-skeleton--title animate-pulse" />
        <span class="summary-skeleton summary-skeleton--value animate-pulse" />
      </template>
      <template v-else>
        <UiTextSmall class="summary-title !text-[var(--color-success)] text-left">
          {{ title }}
        </UiTextSmall>
        <UiTextH3 class="summary-value amount-text !text-[var(--color-success)]">
          {{ formattedAmount }}
        </UiTextH3>
      </template>
    </div>
  </PanelDefault>
</template>

<style scoped lang="scss">
  .summary-widget {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    min-height: 42px;
  }

  .summary-title {
    flex: 0 0 auto;
    width: 100%;
    min-width: 0;
    font-size: clamp(12px, 2.8vw, 15px);
    line-height: 1.2;
    font-weight: 600;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .summary-value {
    flex: 0 0 auto;
    width: 100%;
    min-width: 0;
    text-align: left;
    white-space: nowrap;
  }

  .summary-skeleton {
    display: inline-block;
    border-radius: 999px;
    background: var(--color-stroke-ui-light);
  }

  .summary-skeleton--title {
    width: 42%;
    min-width: 76px;
    height: 12px;
  }

  .summary-skeleton--value {
    width: 36%;
    min-width: 68px;
    height: 20px;
  }

  .amount-text {
    font-size: clamp(16px, 4.5vw, 22px);
    line-height: 1.1;
  }

  @media (min-width: 640px) {
    .summary-widget {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 56px;
    }

    .summary-skeleton--title {
      min-width: 120px;
      height: 14px;
    }

    .summary-skeleton--value {
      width: 32%;
      min-width: 84px;
      height: 26px;
    }

    .amount-text {
      font-size: clamp(20px, 4vw, 28px);
    }

    .summary-title {
      flex: 1 1 auto;
      width: auto;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .summary-value {
      width: auto;
      text-align: right;
    }
  }
</style>
