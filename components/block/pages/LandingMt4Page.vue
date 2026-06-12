<template>
  <UiContainer>
    <section class="mt4-page">
      <header class="mt4-hero">
        <span class="mt4-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageSubtitle }}</p>

        <div class="mt4-hero__meta">
          <span
            v-for="item in currentMeta"
            :key="item">
            {{ item }}
          </span>
        </div>

        <div
          class="mt4-tabs"
          role="tablist"
          aria-label="MetaTrader 4 versions">
          <button
            v-for="tab in tabOptions"
            :key="tab.value"
            type="button"
            class="mt4-tabs__button"
            :class="{ 'mt4-tabs__button--active': activeTab === tab.value }"
            role="tab"
            :aria-selected="activeTab === tab.value"
            @click="selectTab(tab.value)">
            {{ tab.label }}
          </button>
        </div>
      </header>

      <section
        class="mt4-showcase"
        :class="{ 'mt4-showcase--reverse': isMobilePage }">
        <div class="mt4-showcase__content">
          <span
            class="mt4-icon mt4-showcase__icon"
            :data-symbol="isMobilePage ? 'APP' : 'MT4'" />

          <div>
            <span class="mt4-showcase__label">{{ primarySection.label }}</span>
            <h2>{{ primarySection.title }}</h2>
            <p>{{ primarySection.text }}</p>
          </div>

          <div class="mt4-showcase__actions">
            <a
              v-for="action in downloadActions"
              :key="action.href"
              class="mt4-action"
              :class="{ 'mt4-action--secondary': action.secondary }"
              :href="action.href"
              target="_blank"
              rel="noopener noreferrer">
              {{ action.label }}
            </a>
          </div>
        </div>

        <figure
          class="mt4-visual"
          :class="{ 'mt4-visual--mobile': isMobilePage }">
          <img
            v-if="!isMobilePage"
            src="/static/iMac.png"
            alt="MetaTrader 4 desktop terminal"
            loading="eager" />
          <div
            v-else
            class="mt4-visual__devices">
            <img
              src="/static/iPad.png"
              alt="MetaTrader 4 tablet terminal"
              loading="eager" />
            <img
              src="/static/iPhone.png"
              alt="MetaTrader 4 mobile terminal"
              loading="eager" />
          </div>
        </figure>
      </section>

      <section class="mt4-details">
        <div class="mt4-details__intro">
          <span>{{ t("landing.pages.trading.mt4_about_title") }}</span>
          <h2>{{ pageCopy.aboutTitle }}</h2>
          <p>
            {{ t("landing.pages.trading.mt4_about_text") }}
            <strong>{{ t("landing.pages.trading.mt4_about_highlight") }}</strong>
          </p>
        </div>

        <ul class="mt4-details__list">
          <li
            v-for="(feature, index) in mt4Features"
            :key="feature">
            <span
              class="mt4-icon mt4-details__icon"
              :data-symbol="mt4FeatureSymbols[index] ?? 'OK'" />
            <span>{{ feature }}</span>
          </li>
        </ul>
      </section>

      <section class="mt4-mac">
        <div class="mt4-mac__intro">
          <span>{{ pageCopy.mac.eyebrow }}</span>
          <h2>{{ pageCopy.mac.title }}</h2>
          <p>{{ pageCopy.mac.text }}</p>
          <a
            class="mt4-action mt4-action--secondary"
            :href="downloadLinks.mac"
            target="_blank"
            rel="noopener noreferrer">
            {{ pageCopy.mac.button }}
          </a>
        </div>

        <ol class="mt4-mac__steps">
          <li
            v-for="(step, index) in pageCopy.mac.steps"
            :key="step">
            <span>{{ index + 1 }}</span>
            <p>{{ step }}</p>
          </li>
        </ol>
      </section>

      <section class="mt4-requirements">
        <span>{{ t("landing.pages.trading.mt4_requirements_title") }}</span>
        <p>{{ requirementsText }}</p>
        <a
          :href="downloadLinks.windows"
          target="_blank"
          rel="noopener noreferrer">
          {{ pageCopy.desktop.button }}
        </a>
      </section>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";

  const props = withDefaults(
    defineProps<{
      mode?: "desktop" | "mobile";
    }>(),
    {
      mode: "desktop",
    }
  );

  type Mt4SectionCopy = {
    label: string;
    title: string;
    text: string;
    button: string;
  };

  type Mt4MacCopy = {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
    steps: string[];
  };

  type Mt4Tab = "desktop" | "mobile";

  type Mt4DownloadAction = {
    label: string;
    href: string;
    secondary?: boolean;
  };

  type Mt4PageCopy = {
    eyebrow: string;
    tabs: Record<Mt4Tab, string>;
    desktopTitle: string;
    mobileTitle: string;
    desktopSubtitle: string;
    mobileSubtitle: string;
    desktopMeta: string[];
    mobileMeta: string[];
    aboutTitle: string;
    desktop: Mt4SectionCopy;
    mobile: Mt4SectionCopy;
    mobileActions: {
      ios: string;
      android: string;
    };
    mac: Mt4MacCopy;
    requirementsSuffix: string;
  };

  const downloadLinks = {
    windows: "https://download.mql5.com/cdn/web/ester.holdings.ltd/mt4/ester4setup.exe",
    mac: "https://download.terminal.free/cdn/web/metaquotes.software.corp/mt4/MetaTrader4.pkg.zip",
    ios: "https://apps.apple.com/us/app/metatrader-4/id496212596",
    android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader4",
  };

  const localizedCopy: Record<string, Mt4PageCopy> = {
    en: {
      eyebrow: "Trading platform",
      tabs: {
        desktop: "Desktop",
        mobile: "Mobile",
      },
      desktopTitle: "MT4 Desktop",
      mobileTitle: "MT4 Mobile",
      desktopSubtitle: "Download the desktop terminal and manage charts, orders and analytics from one workspace.",
      mobileSubtitle: "Trade and monitor the market from your phone or tablet with the same familiar MetaTrader tools.",
      desktopMeta: ["Windows terminal", "Advanced charts", "Expert Advisors"],
      mobileMeta: ["iOS and Android", "Fast order access", "Live charts"],
      aboutTitle: "A familiar workspace for active trading",
      desktop: {
        label: "Desktop terminal",
        title: "Full MetaTrader 4 workspace on your computer",
        text: "Use multi-window charts, indicators, advisors and detailed order management when you need a complete trading desk.",
        button: "Download desktop",
      },
      mobile: {
        label: "Mobile terminal",
        title: "Market access wherever you are",
        text: "Keep positions, quotes and charts within reach while staying connected to your account outside the desk.",
        button: "Get mobile app",
      },
      mobileActions: {
        ios: "Open App Store",
        android: "Open Google Play",
      },
      mac: {
        eyebrow: "macOS installation",
        title: "Install MetaTrader 4 on macOS",
        text: "The macOS version is installed like a regular application: download the archive, open the installer package and start the terminal from Applications.",
        button: "Download for macOS",
        steps: [
          "Download the MetaTrader 4 package for macOS.",
          "Open the downloaded archive and run the installation package.",
          "Follow the installer steps, then move or launch MetaTrader 4 from Applications.",
          "Open the terminal and connect to your Ester Holdings trading account.",
        ],
      },
      requirementsSuffix: "Windows XP or newer for desktop. Current iOS and Android versions are supported for mobile trading.",
    },
    uk: {
      eyebrow: "Торгова платформа",
      tabs: {
        desktop: "Десктоп",
        mobile: "Мобільна",
      },
      desktopTitle: "MT4 Desktop",
      mobileTitle: "MT4 Mobile",
      desktopSubtitle:
        "Завантажте десктопний термінал і керуйте графіками, ордерами та аналітикою в одному робочому просторі.",
      mobileSubtitle: "Торгуйте й відстежуйте ринок зі смартфона або планшета зі звичними інструментами MetaTrader.",
      desktopMeta: ["Термінал Windows", "Розширені графіки", "Торгові радники"],
      mobileMeta: ["iOS та Android", "Швидкий доступ до ордерів", "Живі графіки"],
      aboutTitle: "Знайомий робочий простір для активної торгівлі",
      desktop: {
        label: "Десктопний термінал",
        title: "Повний простір MetaTrader 4 на вашому комп'ютері",
        text: "Використовуйте багатовіконні графіки, індикатори, радники та детальне керування ордерами для повноцінної торгової роботи.",
        button: "Завантажити desktop",
      },
      mobile: {
        label: "Мобільний термінал",
        title: "Доступ до ринку будь-де",
        text: "Тримайте позиції, котирування та графіки поруч і залишайтесь підключеними до рахунку поза робочим місцем.",
        button: "Отримати mobile",
      },
      mobileActions: {
        ios: "Відкрити App Store",
        android: "Відкрити Google Play",
      },
      mac: {
        eyebrow: "Інсталяція macOS",
        title: "Встановіть MetaTrader 4 на macOS",
        text: "Версія для macOS встановлюється як звичайний застосунок: завантажте архів, відкрийте інсталяційний пакет і запустіть термінал з Applications.",
        button: "Завантажити для macOS",
        steps: [
          "Завантажте пакет MetaTrader 4 для macOS.",
          "Відкрийте завантажений архів і запустіть інсталяційний пакет.",
          "Пройдіть кроки інсталятора, після цього перемістіть або запустіть MetaTrader 4 з Applications.",
          "Відкрийте термінал і підключіться до свого торгового рахунку Ester Holdings.",
        ],
      },
      requirementsSuffix:
        "Windows XP або новіша версія для десктопу. Для мобільної торгівлі підтримуються актуальні версії iOS та Android.",
    },
    ru: {
      eyebrow: "Торговая платформа",
      tabs: {
        desktop: "Десктоп",
        mobile: "Мобильная",
      },
      desktopTitle: "MT4 Desktop",
      mobileTitle: "MT4 Mobile",
      desktopSubtitle:
        "Скачайте десктопный терминал и управляйте графиками, ордерами и аналитикой в одном рабочем пространстве.",
      mobileSubtitle: "Торгуйте и следите за рынком со смартфона или планшета со знакомыми инструментами MetaTrader.",
      desktopMeta: ["Терминал Windows", "Расширенные графики", "Торговые советники"],
      mobileMeta: ["iOS и Android", "Быстрый доступ к ордерам", "Живые графики"],
      aboutTitle: "Знакомое рабочее пространство для активной торговли",
      desktop: {
        label: "Десктопный терминал",
        title: "Полный MetaTrader 4 на вашем компьютере",
        text: "Используйте многооконные графики, индикаторы, советники и детальное управление ордерами для полноценной торговой работы.",
        button: "Скачать desktop",
      },
      mobile: {
        label: "Мобильный терминал",
        title: "Доступ к рынку где бы вы ни были",
        text: "Держите позиции, котировки и графики под рукой и оставайтесь подключенными к счету вне рабочего места.",
        button: "Получить mobile",
      },
      mobileActions: {
        ios: "Открыть App Store",
        android: "Открыть Google Play",
      },
      mac: {
        eyebrow: "Установка macOS",
        title: "Установите MetaTrader 4 на macOS",
        text: "Версия для macOS устанавливается как обычное приложение: скачайте архив, откройте установочный пакет и запустите терминал из Applications.",
        button: "Скачать для macOS",
        steps: [
          "Скачайте пакет MetaTrader 4 для macOS.",
          "Откройте загруженный архив и запустите установочный пакет.",
          "Пройдите шаги установщика, затем переместите или запустите MetaTrader 4 из Applications.",
          "Откройте терминал и подключитесь к своему торговому счёту Ester Holdings.",
        ],
      },
      requirementsSuffix:
        "Windows XP или новее для десктопа. Для мобильной торговли поддерживаются актуальные версии iOS и Android.",
    },
  };

  const { t, tm, locale } = useI18n();
  const mt4FeatureSymbols = ["UI", "APP", "MQL", "NDD"];
  const activeTab = ref<Mt4Tab>(props.mode);

  watch(
    () => props.mode,
    (mode) => {
      activeTab.value = mode;
    }
  );

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const tabOptions = computed(() =>
    (["desktop", "mobile"] as Mt4Tab[]).map((value) => ({
      value,
      label: pageCopy.value.tabs[value],
    }))
  );
  const isMobilePage = computed(() => activeTab.value === "mobile");
  const pageTitle = computed(() => (isMobilePage.value ? pageCopy.value.mobileTitle : pageCopy.value.desktopTitle));
  const pageSubtitle = computed(() =>
    isMobilePage.value ? pageCopy.value.mobileSubtitle : pageCopy.value.desktopSubtitle
  );
  const currentMeta = computed(() => (isMobilePage.value ? pageCopy.value.mobileMeta : pageCopy.value.desktopMeta));
  const primarySection = computed(() => (isMobilePage.value ? pageCopy.value.mobile : pageCopy.value.desktop));
  const requirementsText = computed(() => pageCopy.value.requirementsSuffix);
  const downloadActions = computed<Mt4DownloadAction[]>(() =>
    isMobilePage.value
      ? [
          { label: pageCopy.value.mobileActions.ios, href: downloadLinks.ios },
          { label: pageCopy.value.mobileActions.android, href: downloadLinks.android, secondary: true },
        ]
      : [
          { label: pageCopy.value.desktop.button, href: downloadLinks.windows },
          { label: pageCopy.value.mac.button, href: downloadLinks.mac, secondary: true },
        ]
  );

  const mt4Features = computed(() => {
    const features = tm("landing.pages.trading.mt4_features") as any[];
    return Array.isArray(features) ? features.map((_, index) => t(`landing.pages.trading.mt4_features[${index}]`)) : [];
  });

  const selectTab = (tab: Mt4Tab) => {
    activeTab.value = tab;
  };
</script>

<style lang="scss" scoped>
  .mt4-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    color: var(--landing-text-primary);
  }

  .mt4-hero {
    max-width: 980px;
    margin: 0 auto;
    text-align: center;

    &__eyebrow {
      display: inline-flex;
      margin-bottom: 14px;
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(44px, 6vw, 78px);
      font-weight: 500;
      line-height: 0.98;
    }

    p {
      max-width: 760px;
      margin: 20px auto 0;
      color: var(--landing-text-secondary);
      font-size: clamp(17px, 1.4vw, 20px);
      font-weight: 600;
      line-height: 1.55;
    }

    &__meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 18px;
      margin-top: 28px;

      span {
        display: inline-flex;
        align-items: center;
        color: var(--landing-text-secondary);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.2;

        &::before {
          content: "";
          width: 6px;
          height: 6px;
          margin-right: 10px;
          border-radius: 50%;
          background: var(--landing-accent);
        }
      }
    }
  }

  .mt4-showcase {
    display: grid;
    grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1.18fr);
    gap: clamp(40px, 5vw, 86px);
    align-items: center;

    &--reverse {
      grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);

      .mt4-showcase__content {
        order: 2;
      }
    }

    &__content {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 20px;
      align-items: start;
    }

    &__icon {
      margin-top: 3px;
    }

    &__label {
      display: inline-flex;
      margin-bottom: 12px;
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(28px, 3.2vw, 46px);
      font-weight: 500;
      line-height: 1.08;
    }

    p {
      margin: 16px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.55;
    }

    &__actions {
      grid-column: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-self: start;
      margin-top: 10px;
    }
  }

  .mt4-tabs {
    display: inline-flex;
    gap: 6px;
    margin-top: 32px;
    padding: 6px;
    border: 1px solid color-mix(in srgb, var(--landing-border-strong) 72%, transparent);
    border-radius: 16px;
    background: color-mix(in srgb, var(--landing-surface-glass) 70%, transparent);

    &__button {
      min-width: 132px;
      border: 0;
      border-radius: 12px;
      padding: 13px 18px;
      background: transparent;
      color: var(--landing-text-secondary);
      cursor: pointer;
      font-size: 15px;
      font-weight: 900;
      transition:
        background-color 180ms ease,
        color 180ms ease;

      &--active {
        background: var(--landing-accent);
        color: #fff;
      }
    }
  }

  .mt4-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    min-width: 196px;
    border: 1px solid var(--landing-accent);
    border-radius: 14px;
    padding: 13px 24px;
    background: var(--landing-accent);
    color: #fff;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.15;
    text-decoration: none;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease;

    &:hover {
      border-color: var(--landing-accent-hover);
      background: var(--landing-accent-hover);
      color: #fff;
    }

    &--secondary {
      background: transparent;
      color: var(--landing-accent);

      &:hover {
        background: color-mix(in srgb, var(--landing-accent) 12%, transparent);
        color: var(--landing-accent-hover);
      }
    }
  }

  .mt4-visual {
    display: flex;
    justify-content: center;
    margin: 0;
    overflow: visible;

    img {
      display: block;
      max-width: min(100%, 620px);
      height: auto;
      object-fit: contain;
    }

    &--mobile {
      align-items: flex-end;

      .mt4-visual__devices {
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: min(100%, 500px);
        min-height: 320px;
      }

      img:first-child {
        max-width: min(84%, 360px);
      }

      img:last-child {
        position: absolute;
        right: 0;
        bottom: 0;
        max-width: min(34%, 150px);
      }
    }
  }

  .mt4-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 42%, transparent);
    border-radius: 16px;
    background: color-mix(in srgb, var(--landing-surface-elevated) 20%, transparent);
    color: var(--landing-accent);
    font-size: 13px;
    font-weight: 900;
    line-height: 1;

    &::before {
      content: attr(data-symbol);
    }
  }

  .mt4-details {
    display: grid;
    grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
    gap: 34px;
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding: clamp(38px, 4vw, 58px) 0 0;

    &__intro {
      span {
        color: var(--landing-accent);
        font-size: 13px;
        font-weight: 900;
        text-transform: uppercase;
      }

      h2 {
        margin: 12px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(28px, 3vw, 42px);
        font-weight: 500;
        line-height: 1.08;
      }

      p {
        margin: 16px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 600;
        line-height: 1.55;

        strong {
          display: block;
          margin-top: 12px;
          color: var(--landing-text-primary);
        }
      }
    }

    &__list {
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: 76px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
        border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
        padding-bottom: 16px;
        color: var(--landing-text-primary);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.45;

        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }
    }

    &__icon {
      width: 54px;
      height: 54px;
      border-radius: 15px;
      font-size: 12px;
    }
  }

  .mt4-mac {
    display: grid;
    grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
    gap: 34px;
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(34px, 4vw, 54px);

    &__intro {
      span {
        color: var(--landing-accent);
        font-size: 13px;
        font-weight: 900;
        text-transform: uppercase;
      }

      h2 {
        margin: 12px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(26px, 3vw, 40px);
        font-weight: 500;
        line-height: 1.08;
      }

      p {
        margin: 14px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 600;
        line-height: 1.55;
      }

      .mt4-action {
        margin-top: 20px;
      }
    }

    &__steps {
      display: grid;
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: 54px minmax(0, 1fr);
        gap: 16px;
        align-items: center;
        border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
        padding-bottom: 16px;

        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }

      span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 42%, transparent);
        border-radius: 14px;
        background: color-mix(in srgb, var(--landing-surface-elevated) 20%, transparent);
        color: var(--landing-accent);
        font-size: 18px;
        font-weight: 900;
      }

      p {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.45;
      }
    }
  }

  .mt4-requirements {
    display: grid;
    gap: 10px;
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(30px, 4vw, 46px);

    span {
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
    }

    p {
      max-width: 760px;
      margin: 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.55;
    }

    a {
      color: var(--landing-accent);
      font-size: 15px;
      font-weight: 900;
      text-decoration: none;

      &:hover {
        color: var(--landing-accent-hover);
      }
    }
  }

  @media (max-width: 991px) {
    .mt4-page {
      gap: 34px;
    }

    .mt4-showcase,
    .mt4-showcase--reverse,
    .mt4-details,
    .mt4-mac {
      grid-template-columns: 1fr;
    }

    .mt4-showcase--reverse .mt4-showcase__content {
      order: initial;
    }

    .mt4-visual {
      justify-content: flex-start;
    }
  }

  @media (max-width: 575px) {
    .mt4-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .mt4-showcase__content,
    .mt4-details__list li {
      grid-template-columns: 1fr;
    }

    .mt4-showcase__actions {
      grid-column: 1;
    }

    .mt4-tabs {
      display: flex;
      width: 100%;

      &__button {
        flex: 1;
        min-width: 0;
      }
    }

    .mt4-action {
      width: 100%;
    }

    .mt4-visual--mobile {
      .mt4-visual__devices {
        min-height: 260px;
      }

      img:first-child {
        max-width: min(82%, 300px);
      }

      img:last-child {
        max-width: min(34%, 118px);
      }
    }
  }
</style>
