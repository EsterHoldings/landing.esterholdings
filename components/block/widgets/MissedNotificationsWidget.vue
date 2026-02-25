<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import UiTextSmall from "~/components/ui/UiTextSmall.vue";
import UiTextH3 from "~/components/ui/UiTextH3.vue";

const props = withDefaults(
  defineProps<{
    total: number;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
  },
);

const { t } = useI18n({ useScope: "global" });
const resolveText = (key: string, fallback: string) => {
  const value = t(key);
  return value === key ? fallback : value;
};
const title = computed(() =>
  resolveText("cabinet.dashboard.summary.missedNotifications", "Missed notifications"),
);
</script>

<template>
  <PanelDefault class="relative h-full min-h-[72px] p-2.5 sm:min-h-[88px] sm:p-3.5">
    <div class="summary-widget">
      <template v-if="props.isLoading">
        <span class="summary-skeleton summary-skeleton--title animate-pulse" />
        <span class="summary-skeleton summary-skeleton--value animate-pulse" />
      </template>
      <template v-else>
        <UiTextSmall class="summary-title !text-[var(--color-warning)] text-left">
          {{ title }}
        </UiTextSmall>
        <UiTextH3
          class="summary-value amount-text !text-[var(--color-warning)] text-right whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {{ props.total }}
        </UiTextH3>
      </template>
    </div>
  </PanelDefault>
</template>

<style scoped lang="scss">
.summary-widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 42px;
}

.summary-title {
  flex: 1 1 auto;
  min-width: 0;
}

.summary-value {
  flex: 0 0 auto;
  min-width: 0;
}

.summary-skeleton {
  display: inline-block;
  border-radius: 999px;
  background: var(--color-stroke-ui-light);
}

.summary-skeleton--title {
  width: 42%;
  min-width: 76px;
  height: 10px;
}

.summary-skeleton--value {
  width: 30%;
  min-width: 34px;
  height: 20px;
}

.amount-text {
  font-size: clamp(16px, 4.5vw, 22px);
  line-height: 1.1;
}

@media (min-width: 640px) {
  .summary-widget {
    gap: 12px;
    min-height: 56px;
  }

  .summary-skeleton--title {
    min-width: 120px;
    height: 12px;
  }

  .summary-skeleton--value {
    width: 24%;
    min-width: 44px;
    height: 26px;
  }

  .amount-text {
    font-size: clamp(20px, 4vw, 28px);
  }
}
</style>
