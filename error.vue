<template>
  <main class="landing-error">
    <div class="landing-error__glow landing-error__glow--left" aria-hidden="true" />
    <div class="landing-error__glow landing-error__glow--right" aria-hidden="true" />

    <UiContainer>
      <section class="landing-error__shell">
        <header class="landing-error__topbar">
          <button class="landing-error__brand" type="button" @click="handlePrimaryAction">
            <UiIconLogoLight v-if="themeStore.currentTheme === 'light'" />
            <UiIconLogo v-else />
          </button>

          <div class="landing-error__status">
            <span>{{ pageCopy.statusLabel }}</span>
            <strong>{{ statusCode }}</strong>
          </div>
        </header>

        <div class="landing-error__content">
          <div class="landing-error__copy">
            <p class="landing-error__eyebrow">
              {{ pageCopy.eyebrow }}
            </p>

            <h1>{{ pageCopy.title }}</h1>

            <p class="landing-error__description">
              {{ pageCopy.description }}
            </p>

            <div class="landing-error__actions">
              <UiButtonV2 @click="handlePrimaryAction">
                {{ pageCopy.primaryAction }}
              </UiButtonV2>

              <UiButtonV2 variant="secondary" @click="handleSecondaryAction">
                {{ pageCopy.secondaryAction }}
              </UiButtonV2>
            </div>

            <dl class="landing-error__details">
              <div>
                <dt>{{ pageCopy.pathLabel }}</dt>
                <dd>{{ currentPath }}</dd>
              </div>

              <div>
                <dt>{{ pageCopy.tipLabel }}</dt>
                <dd>{{ pageCopy.tip }}</dd>
              </div>
            </dl>
          </div>

          <aside class="landing-error__panel" aria-hidden="true">
            <div class="landing-error__panel-code">
              {{ statusCode }}
            </div>

            <div class="landing-error__panel-card">
              <span class="landing-error__panel-kicker">{{ pageCopy.panelKicker }}</span>
              <p>{{ pageCopy.panelText }}</p>
            </div>
          </aside>
        </div>
      </section>
    </UiContainer>
  </main>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { clearError, useHead, useRequestURL } from "#imports";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import UiButtonV2 from "~/components/ui/UiButtonV2.vue";
  import UiIconLogo from "~/components/ui/UiIconLogo.vue";
  import UiIconLogoLight from "~/components/ui/UiIconLogoLight.vue";
  import {
    buildThemeInitScript,
    DARK_BROWSER_THEME_COLOR,
    LIGHT_BROWSER_THEME_COLOR,
  } from "~/composables/theme/theme.shared";
  import { useThemeStore } from "~/stores/themeStore";

  const props = defineProps<{
    error?: {
      statusCode?: number;
      statusMessage?: string;
      message?: string;
    };
  }>();

  const themeStore = useThemeStore();
  const requestUrl = useRequestURL();
  const themeInitScript = buildThemeInitScript();

  const statusCode = computed(() => Number(props.error?.statusCode ?? 500));
  const currentPath = computed(() => requestUrl.pathname || "/");
  const localeCode = computed(() => currentPath.value.match(/^\/([a-z]{2})(?:\/|$)/)?.[1] ?? "en");
  const normalizedLocaleCode = computed(() => (localeCode.value === "ua" ? "uk" : localeCode.value));
  const isNotFound = computed(() => statusCode.value === 404);
  const homePath = computed(() => {
    const prefix = currentPath.value.match(/^\/([a-z]{2})(?:\/|$)/)?.[1];
    return prefix ? `/${prefix}` : "/";
  });

  const browserThemeColor = computed(() =>
    themeStore.currentTheme === "dark" ? DARK_BROWSER_THEME_COLOR : LIGHT_BROWSER_THEME_COLOR
  );

  const copyMap = {
    en: {
      statusLabel: "Status",
      server: {
        eyebrow: "Temporary issue",
        title: "We are already restoring this page",
        description:
          "The request reached the server, but the page is temporarily unavailable. Reload the page or return to the main screen.",
        primaryAction: "Go to home page",
        secondaryAction: "Reload page",
        tip: "If the problem persists, retry this action a little later.",
        panelKicker: "Connection kept",
        panelText: "Your session is safe. Return to the landing page and continue from there.",
      },
      notFound: {
        eyebrow: "Page unavailable",
        title: "We could not find this page",
        description: "The address may be outdated or the page may have moved. Return to the main screen and continue navigation from there.",
        primaryAction: "Go to home page",
        secondaryAction: "Go back",
        tip: "Check the link or open the needed section again from the main navigation.",
        panelKicker: "Route mismatch",
        panelText: "The requested address does not exist in the current landing structure.",
      },
      pathLabel: "Request path",
      tipLabel: "What to do next",
    },
    ru: {
      statusLabel: "Статус",
      server: {
        eyebrow: "Временная проблема",
        title: "Мы уже восстанавливаем эту страницу",
        description:
          "Запрос дошел до сервера, но страница сейчас временно недоступна. Обновите страницу или вернитесь на главный экран.",
        primaryAction: "На главную",
        secondaryAction: "Обновить страницу",
        tip: "Если проблема повторяется, попробуйте выполнить действие немного позже.",
        panelKicker: "Соединение сохранено",
        panelText: "Ваша сессия в порядке. Вернитесь на лендинг и продолжайте оттуда.",
      },
      notFound: {
        eyebrow: "Страница недоступна",
        title: "Мы не нашли эту страницу",
        description: "Адрес мог устареть или страница была перенесена. Вернитесь на главный экран и продолжайте навигацию оттуда.",
        primaryAction: "На главную",
        secondaryAction: "Назад",
        tip: "Проверьте ссылку или откройте нужный раздел заново через основную навигацию.",
        panelKicker: "Маршрут не найден",
        panelText: "Запрошенного адреса нет в текущей структуре лендинга.",
      },
      pathLabel: "Путь запроса",
      tipLabel: "Что делать дальше",
    },
    uk: {
      statusLabel: "Статус",
      server: {
        eyebrow: "Тимчасова проблема",
        title: "Ми вже відновлюємо цю сторінку",
        description:
          "Запит дійшов до сервера, але сторінка тимчасово недоступна. Оновіть сторінку або поверніться на головний екран.",
        primaryAction: "На головну",
        secondaryAction: "Оновити сторінку",
        tip: "Якщо проблема повторюється, спробуйте виконати дію трохи пізніше.",
        panelKicker: "З'єднання збережено",
        panelText: "Ваша сесія в порядку. Поверніться на лендинг і продовжуйте звідти.",
      },
      notFound: {
        eyebrow: "Сторінка недоступна",
        title: "Ми не знайшли цю сторінку",
        description: "Адреса могла застаріти або сторінку було перенесено. Поверніться на головний екран і продовжуйте навігацію звідти.",
        primaryAction: "На головну",
        secondaryAction: "Назад",
        tip: "Перевірте посилання або відкрийте потрібний розділ ще раз через основну навігацію.",
        panelKicker: "Маршрут не знайдено",
        panelText: "Запитаної адреси немає в поточній структурі лендингу.",
      },
      pathLabel: "Шлях запиту",
      tipLabel: "Що робити далі",
    },
  } as const;

  const localizedCopy = computed(() => copyMap[normalizedLocaleCode.value as keyof typeof copyMap] ?? copyMap.en);
  const pageCopy = computed(() => ({
    ...(isNotFound.value ? localizedCopy.value.notFound : localizedCopy.value.server),
    statusLabel: localizedCopy.value.statusLabel,
    pathLabel: localizedCopy.value.pathLabel,
    tipLabel: localizedCopy.value.tipLabel,
  }));

  const pageTitle = computed(() => `Ester Holdings | ${statusCode.value}`);

  const handlePrimaryAction = async () => {
    await clearError({ redirect: homePath.value });
  };

  const handleSecondaryAction = async () => {
    if (isNotFound.value) {
      if (import.meta.client && window.history.length > 1) {
        window.history.back();
        return;
      }

      await clearError({ redirect: homePath.value });
      return;
    }

    if (import.meta.client) {
      window.location.reload();
      return;
    }

    await clearError({ redirect: currentPath.value });
  };

  useHead(() => ({
    title: pageTitle.value,
    htmlAttrs: {
      "data-theme": themeStore.currentTheme,
      style: `color-scheme: ${themeStore.currentTheme};`,
    },
    bodyAttrs: {
      class: "landing-error-route",
    },
    meta: [
      { name: "theme-color", content: browserThemeColor.value },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: themeStore.currentTheme === "dark" ? "black" : "default",
      },
    ],
    script: [
      {
        key: "theme-init",
        tagPosition: "head",
        children: themeInitScript,
      },
    ],
  }));
</script>

<style lang="scss" scoped>
  .landing-error {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: 32px 0;
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--landing-bg) 96%, #ffffff 4%) 0%, var(--landing-bg) 100%);
    color: var(--landing-text-primary);

    &__glow {
      position: absolute;
      inset: auto;
      border-radius: 999px;
      filter: blur(14px);
      pointer-events: none;

      &--left {
        top: 8%;
        left: -120px;
        width: 360px;
        height: 360px;
        background: var(--landing-blob-left);
        opacity: 0.9;
      }

      &--right {
        right: -90px;
        bottom: 4%;
        width: 420px;
        height: 420px;
        background: var(--landing-blob-right);
        opacity: 0.9;
      }
    }

    &__shell {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 32px;
      min-height: calc(100vh - 64px);
      padding: clamp(24px, 3vw, 36px);
      border: 1px solid color-mix(in srgb, var(--landing-border-strong) 68%, transparent);
      border-radius: 40px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--landing-surface) 92%, transparent), color-mix(in srgb, var(--landing-surface-elevated) 84%, transparent));
      box-shadow: var(--landing-shadow-glass-raised);
      backdrop-filter: blur(24px);
    }

    &__topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    &__brand {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }

    &__status {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 10px 18px;
      border: 1px solid color-mix(in srgb, var(--landing-line) 54%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--landing-surface-glass) 90%, transparent);
      color: var(--landing-text-secondary);
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      strong {
        color: var(--landing-text-strong);
        font-size: 18px;
        letter-spacing: 0.02em;
      }
    }

    &__content {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 32px;
      align-items: center;
      flex: 1;
    }

    &__copy {
      max-width: 720px;

      h1 {
        margin: 18px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(44px, 5vw, 84px);
        font-weight: 400;
        letter-spacing: -0.04em;
        line-height: 0.96;
      }
    }

    &__eyebrow {
      margin: 0;
      color: var(--landing-accent);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    &__description {
      max-width: 560px;
      margin: 24px 0 0;
      color: var(--landing-text-secondary);
      font-size: 18px;
      line-height: 1.55;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 36px;
    }

    &__details {
      display: grid;
      gap: 16px;
      margin: 36px 0 0;

      div {
        display: grid;
        gap: 6px;
        padding: 18px 20px;
        border: 1px solid color-mix(in srgb, var(--landing-line) 46%, transparent);
        border-radius: 22px;
        background: color-mix(in srgb, var(--landing-surface-glass) 82%, transparent);
      }

      dt {
        color: var(--landing-text-tertiary);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      dd {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 16px;
        line-height: 1.45;
        word-break: break-word;
      }
    }

    &__panel {
      position: relative;
      display: grid;
      gap: 20px;
      align-self: stretch;
      min-height: 100%;
      padding: 28px;
      border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 38%, transparent);
      border-radius: 32px;
      background:
        radial-gradient(circle at top, color-mix(in srgb, var(--landing-accent) 16%, transparent), transparent 56%),
        linear-gradient(160deg, color-mix(in srgb, var(--landing-surface-elevated) 92%, transparent), color-mix(in srgb, var(--landing-surface) 84%, transparent));
      box-shadow: var(--landing-shadow-card);
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset: auto -20% -45% auto;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--landing-accent-secondary) 18%, transparent);
        filter: blur(18px);
      }
    }

    &__panel-code {
      position: relative;
      z-index: 1;
      color: var(--landing-text-strong);
      font-size: clamp(96px, 14vw, 180px);
      font-weight: 500;
      letter-spacing: -0.08em;
      line-height: 0.9;
      text-align: right;
    }

    &__panel-card {
      position: relative;
      z-index: 1;
      margin-top: auto;
      padding: 20px 22px;
      border: 1px solid color-mix(in srgb, var(--landing-line) 44%, transparent);
      border-radius: 24px;
      background: color-mix(in srgb, var(--landing-overlay) 88%, transparent);
      backdrop-filter: blur(16px);

      p {
        margin: 12px 0 0;
        color: var(--landing-text-primary);
        font-size: 16px;
        line-height: 1.5;
      }
    }

    &__panel-kicker {
      color: var(--landing-accent-secondary);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
  }

  @media (max-width: 991px) {
    .landing-error {
      padding: 20px 0;

      &__shell {
        min-height: calc(100vh - 40px);
        padding: 24px 20px;
        border-radius: 28px;
      }

      &__content {
        grid-template-columns: 1fr;
      }

      &__panel {
        min-height: 0;
      }

      &__panel-code {
        text-align: left;
      }
    }
  }

  @media (max-width: 575px) {
    .landing-error {
      &__topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      &__description {
        font-size: 16px;
      }

      &__actions {
        flex-direction: column;
      }

      &__details {
        div {
          padding: 16px 18px;
        }
      }
    }
  }
</style>
