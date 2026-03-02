<template>
  <div class="mt4-widget dashboard-side-widget flex flex-col gap-4 text-[var(--ui-text-main)]">
    <div class="mt4-header-card">
      <div class="mt4-header-card__title">
        {{ t("cabinet.dashboard.mt4.title") }}
      </div>
      <div class="mt4-header-card__actions">
        <NuxtLink
          v-if="canCreateAccount"
          :to="profileAccountsCreateLink"
          class="w-full sm:w-auto">
          <UiButtonDefault
            state="primary"
            class="w-full sm:w-auto">
            {{ t("cabinet.dashboard.mt4.openNewAccount") }}
          </UiButtonDefault>
        </NuxtLink>
        <NuxtLink
          v-else
          :to="profileVerificationLink"
          class="w-full sm:w-auto">
          <UiButtonDefault
            state="info--outline"
            class="w-full sm:w-auto">
            {{ verifyActionLabel }}
          </UiButtonDefault>
        </NuxtLink>
      </div>
    </div>

    <div class="mt4-list-wrap">
      <div
        v-if="isLoading"
        class="mt4-list">
        <div
          v-for="idx in 3"
          :key="idx"
          class="verification-item mt4-card mt4-grid animate-pulse">
          <div class="mt4-star h-8 w-8 rounded-md bg-[var(--color-stroke-ui-light)]"></div>
          <div class="mt4-type space-y-2">
            <div class="h-3 w-24 rounded bg-[var(--color-stroke-ui-light)]"></div>
            <div class="h-4 w-28 rounded bg-[var(--color-stroke-ui-light)]"></div>
            <div class="h-3 w-20 rounded bg-[var(--color-stroke-ui-light)]"></div>
          </div>
          <div class="mt4-account space-y-2">
            <div class="h-3 w-16 rounded bg-[var(--color-stroke-ui-light)]"></div>
            <div class="h-4 w-24 rounded bg-[var(--color-stroke-ui-light)]"></div>
          </div>
          <div class="mt4-balance space-y-2">
            <div class="h-3 w-16 rounded bg-[var(--color-stroke-ui-light)]"></div>
            <div class="h-4 w-28 rounded bg-[var(--color-stroke-ui-light)]"></div>
          </div>
          <div class="mt4-badge h-6 w-16 rounded bg-[var(--color-stroke-ui-light)]"></div>
        </div>
      </div>

      <div
        v-else
        class="mt4-list">
        <div
          v-if="visibleAccounts.length === 0"
          class="mt4-empty-state">
          <div class="mt4-empty-state__icon-wrap">
            <UiIconCardCheck class="mt4-empty-state__icon" />
          </div>
          <div class="mt4-empty-state__title">
            {{ currentEmptyTitle }}
          </div>
          <UiTextSmall class="mt4-empty-state__subtitle">
            {{ currentEmptySubtitle }}
          </UiTextSmall>
          <UiTextSmall
            v-if="!canCreateAccount && blockedReasonText"
            class="mt4-empty-state__warning">
            {{ blockedReasonText }}
          </UiTextSmall>

          <NuxtLink
            v-if="canCreateAccount"
            :to="profileAccountsCreateLink"
            class="w-full sm:w-auto">
            <UiButtonDefault
              state="success--outline"
              class="w-full sm:w-auto">
              {{ openAccountLabel }}
            </UiButtonDefault>
          </NuxtLink>
          <NuxtLink
            v-else
            :to="profileVerificationLink"
            class="w-full sm:w-auto">
            <UiButtonDefault
              state="info--outline"
              class="w-full sm:w-auto">
              {{ verifyActionLabel }}
            </UiButtonDefault>
          </NuxtLink>
        </div>

        <div
          v-for="account in visibleAccounts"
          :key="account.id"
          class="verification-item mt4-card mt4-grid">
          <button
            class="mt4-star flex h-8 w-8 items-center justify-center rounded-md transition text-[var(--ui-text-secondary)]"
            type="button"
            :aria-pressed="account.is_favorite"
            :title="account.is_favorite ? 'Remove from favorites' : 'Add to favorites'"
            @click.stop="emit('toggle-favorite', account.id)">
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4"
              :fill="account.is_favorite ? 'var(--ui-primary-accent)' : 'none'"
              :stroke="account.is_favorite ? 'var(--ui-primary-accent)' : 'var(--ui-text-secondary)'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
          <div class="mt4-type min-w-0 text-[var(--ui-text-main)]">
            <UiTextSmall class="text-[var(--ui-text-secondary)]">
              {{ t("cabinet.dashboard.mt4.table.type") }}
            </UiTextSmall>
            <div class="truncate font-semibold">{{ account.type }}</div>
            <UiTextSmall class="text-[var(--ui-text-secondary)] truncate">
              {{ t("cabinet.accounts.columns.leverage") }}: {{ account.leverage }}
            </UiTextSmall>
          </div>
          <div class="mt4-account min-w-0 text-[var(--ui-text-main)]">
            <UiTextSmall class="text-[var(--ui-text-secondary)]">
              {{ t("cabinet.dashboard.mt4.table.account") }}
            </UiTextSmall>
            <UiTextSmall class="text-[var(--ui-text-main)] font-semibold truncate"> MT4 {{ account.id }} </UiTextSmall>
          </div>
          <div class="mt4-balance min-w-0 text-[var(--ui-text-main)]">
            <UiTextSmall class="text-[var(--ui-text-secondary)]">
              {{ t("cabinet.dashboard.mt4.table.balance") }}
            </UiTextSmall>
            <div class="truncate font-semibold">
              {{ account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              {{ account.currency }}
            </div>
          </div>
          <UiBadge
            :state="mt4BadgeState(account.status)"
            outline
            class="mt4-badge border text-xs !px-3 !py-1 bg-[var(--color-stroke-ui-dark)]">
            {{ statusText[account.status]() }}
          </UiBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, toRefs } from "vue";
  import { useI18n } from "vue-i18n";
  import { useLocalePath } from "~/.nuxt/imports";

  import UiTextSmall from "~/components/ui/UiTextSmall.vue";
  import UiBadge from "~/components/ui/UiBadge.vue";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
  import UiIconCardCheck from "~/components/ui/UiIconCardCheck.vue";

  type Mt4Status = "active" | "inactive";
  type Mt4Account = {
    id: string;
    type: string;
    leverage: string;
    currency: string;
    balance: number;
    status: Mt4Status;
    is_favorite: boolean;
    favorite_at?: string | null;
  };

  const props = withDefaults(
    defineProps<{
      accounts: Mt4Account[];
      isLoading?: boolean;
      canCreateAccount?: boolean;
      accountCreationBlockedReason?: string;
    }>(),
    {
      isLoading: false,
      canCreateAccount: true,
      accountCreationBlockedReason: "",
    }
  );

  const { isLoading } = toRefs(props);

  const emit = defineEmits<{
    (event: "toggle-favorite", id: string): void;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const localePath = useLocalePath();

  const profileAccountsCreateLink = computed(() => localePath({ path: "/accounts", query: { openCreate: "1" } }));
  const profileVerificationLink = computed(() => localePath({ path: "/profile", query: { tab: "verification" } }));
  const canCreateAccount = computed(() => !!props.canCreateAccount);

  const statusText = {
    active: () => t("cabinet.dashboard.mt4.table.active"),
    inactive: () => t("cabinet.dashboard.mt4.table.inactive"),
  };

  const resolveText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const emptyTitle = computed(() => resolveText("cabinet.dashboard.mt4.emptyTitle", "Счетов пока нет"));
  const emptySubtitle = computed(() =>
    resolveText("cabinet.dashboard.mt4.emptySubtitle", "Откройте первый торговый счет, чтобы начать работу.")
  );
  const verifyTitle = computed(() =>
    resolveText("cabinet.dashboard.mt4.verifyTitle", "Завершите верификацию для открытия счёта")
  );
  const verifySubtitle = computed(() =>
    resolveText(
      "cabinet.dashboard.mt4.verifySubtitle",
      "Подтвердите данные профиля и документы, после этого сможете открыть MT4 счёт."
    )
  );
  const openAccountLabel = computed(() => resolveText("cabinet.accounts.openAccount", "Открыть счет"));
  const verifyActionLabel = computed(() =>
    resolveText("cabinet.dashboard.accountVerification.goToVerification", "Перейти к верификации")
  );
  const currentEmptyTitle = computed(() => (canCreateAccount.value ? emptyTitle.value : verifyTitle.value));
  const currentEmptySubtitle = computed(() => (canCreateAccount.value ? emptySubtitle.value : verifySubtitle.value));
  const blockedReasonText = computed(() => {
    const raw = String(props.accountCreationBlockedReason || "").trim();
    return raw;
  });

  const mt4BadgeState = (status: Mt4Status) => {
    return status === "active" ? "success" : "warning";
  };

  const visibleAccounts = computed(() => {
    const accounts = Array.isArray(props.accounts) ? props.accounts : [];
    const favorites = accounts.filter(account => account.is_favorite).sort((a, b) => b.balance - a.balance);
    const remaining = accounts.filter(account => !account.is_favorite).sort((a, b) => b.balance - a.balance);

    return [...favorites, ...remaining].slice(0, 3);
  });
</script>

<style scoped>
  .dashboard-side-widget {
    --dashboard-side-widget-height: clamp(360px, 43vh, 440px);
    min-height: var(--dashboard-side-widget-height);
    height: var(--dashboard-side-widget-height);
    overflow: hidden;
    border-radius: 14px;
    border: 0;
    background: var(--ui-background-panel);
    padding: 12px;
  }

  .mt4-header-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: -12px -12px 0;
    padding: 12px;
    min-height: 64px;
    box-sizing: border-box;
    border-radius: 0;
    background:
      linear-gradient(136deg, color-mix(in srgb, var(--ui-primary-main) 10%, transparent) 0%, transparent 70.44%),
      var(--ui-background-card);
  }

  .mt4-header-card__title {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.1;
  }

  .mt4-header-card__actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }

  .mt4-list-wrap {
    min-height: 0;
    flex: 1;
  }

  .mt4-list {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    align-content: start;
    overflow-y: auto;
    padding-right: 4px;
  }

  .mt4-empty-state {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 10px;
    padding: 18px 12px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-background-card) 72%, transparent);
    border: 1px dashed var(--color-stroke-ui-light);
  }

  .mt4-empty-state__icon-wrap {
    height: 56px;
    width: 56px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--ui-primary-main) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--ui-primary-main) 40%, transparent);
  }

  .mt4-empty-state__icon {
    width: 24px;
    height: 24px;
    color: var(--ui-primary-main);
  }

  .mt4-empty-state__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ui-text-main);
  }

  .mt4-empty-state__subtitle {
    color: var(--ui-text-secondary);
    max-width: 320px;
  }

  .mt4-empty-state__warning {
    color: var(--color-warning);
    max-width: 360px;
  }

  .mt4-card {
    background: transparent;
    border-radius: 8px;
    padding: 10px 12px;
    transition: background-color 0.2s ease;
  }

  .mt4-card:hover {
    background: var(--ui-background-card);
  }

  .mt4-grid {
    display: grid;
    grid-template-columns: 44px repeat(3, minmax(0, 1fr)) minmax(0, 1fr);
    gap: 14px;
    align-items: center;
    grid-template-areas: "star type account balance badge";
  }

  .mt4-grid > * {
    min-width: 0;
  }

  .mt4-star {
    grid-area: star;
  }
  .mt4-star:hover {
    background: var(--ui-background-card);
  }
  .mt4-type {
    grid-area: type;
  }
  .mt4-account {
    grid-area: account;
  }
  .mt4-balance {
    grid-area: balance;
  }
  .mt4-badge {
    grid-area: badge;
    justify-self: end;
  }

  .verification-item {
    border-radius: 12px;
    background: transparent;
    border: 0;
    padding: 10px 12px;
    min-height: 92px;
    transition: background-color 0.2s ease;
  }

  .verification-item:hover {
    background: var(--ui-background-card);
  }

  @media (max-width: 767px) {
    .mt4-header-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .mt4-grid {
      grid-template-columns: 44px 1fr 1fr;
      grid-template-areas:
        "star type badge"
        "star account badge"
        "star balance badge";
      gap: 10px 12px;
      align-items: start;
    }
  }

  @media (min-width: 640px) {
    .mt4-header-card__actions {
      width: auto;
      flex-direction: row;
      align-items: center;
    }
  }

  @media (max-width: 1023px) {
    .dashboard-side-widget {
      min-height: 0;
      height: auto;
    }

    .mt4-list {
      height: auto;
      overflow: visible;
      padding-right: 0;
    }
  }
</style>
