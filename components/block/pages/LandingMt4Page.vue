<template>
  <UiContainer>
    <section
      ref="mt4Ref"
      class="mt4-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
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
      </header>

      <section
        class="mt4-showcase"
        :class="{ 'mt4-showcase--reverse': isMobilePage }">
        <div class="mt4-showcase__content">
          <span class="mt4-number mt4-showcase__number">
            <span class="mt4-number__orb mt4-number__orb--solid" />
            <span class="mt4-number__orb mt4-number__orb--glow" />
            <span class="mt4-number__value">{{ isMobilePage ? 2 : 1 }}</span>
          </span>

          <div>
            <span class="mt4-showcase__label">{{ primarySection.label }}</span>
            <h2>{{ primarySection.title }}</h2>
            <p>{{ primarySection.text }}</p>
          </div>

          <UiButtonDefault
            state="primary"
            class="mt4-showcase__button">
            {{ primarySection.button }}
          </UiButtonDefault>
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
              class="mt4-number mt4-details__number"
              :class="`mt4-number--${index + 3}`">
              <span class="mt4-number__orb mt4-number__orb--solid" />
              <span class="mt4-number__orb mt4-number__orb--glow" />
              <span class="mt4-number__value">{{ index + 3 }}</span>
            </span>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </section>

      <section class="mt4-compare">
        <article
          v-for="section in secondarySections"
          :key="section.title">
          <span class="mt4-compare__eyebrow">{{ section.label }}</span>
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
          <NuxtLink :to="localizedPath(section.path)">
            {{ section.link }}
          </NuxtLink>
        </article>
      </section>

      <section class="mt4-requirements">
        <span>{{ t("landing.pages.trading.mt4_requirements_title") }}</span>
        <p>{{ requirementsText }}</p>
        <a href="#">
          {{ t("landing.pages.trading.mt4_requirements_link") }}
        </a>
      </section>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";

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
    path: string;
    link: string;
  };

  type Mt4PageCopy = {
    eyebrow: string;
    desktopTitle: string;
    mobileTitle: string;
    desktopSubtitle: string;
    mobileSubtitle: string;
    desktopMeta: string[];
    mobileMeta: string[];
    aboutTitle: string;
    desktop: Mt4SectionCopy;
    mobile: Mt4SectionCopy;
    requirementsSuffix: string;
  };

  const localizedCopy: Record<string, Mt4PageCopy> = {
    en: {
      eyebrow: "Trading platform",
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
        path: "/mt-4",
        link: "Open desktop page",
      },
      mobile: {
        label: "Mobile terminal",
        title: "Market access wherever you are",
        text: "Keep positions, quotes and charts within reach while staying connected to your account outside the desk.",
        button: "Get mobile app",
        path: "/mt-4-mobile",
        link: "Open mobile page",
      },
      requirementsSuffix:
        "For the desktop terminal, use Windows XP or newer. Mobile apps are available for current iOS and Android devices.",
    },
    uk: {
      eyebrow: "Торгова платформа",
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
        path: "/mt-4",
        link: "Відкрити desktop",
      },
      mobile: {
        label: "Мобільний термінал",
        title: "Доступ до ринку будь-де",
        text: "Тримайте позиції, котирування та графіки поруч і залишайтесь підключеними до рахунку поза робочим місцем.",
        button: "Отримати mobile",
        path: "/mt-4-mobile",
        link: "Відкрити mobile",
      },
      requirementsSuffix:
        "Для десктопного терміналу використовуйте Windows XP або новішу версію. Мобільні застосунки доступні для актуальних iOS та Android.",
    },
    ru: {
      eyebrow: "Торговая платформа",
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
        path: "/mt-4",
        link: "Открыть desktop",
      },
      mobile: {
        label: "Мобильный терминал",
        title: "Доступ к рынку где бы вы ни были",
        text: "Держите позиции, котировки и графики под рукой и оставайтесь подключенными к счету вне рабочего места.",
        button: "Получить mobile",
        path: "/mt-4-mobile",
        link: "Открыть mobile",
      },
      requirementsSuffix:
        "Для десктопного терминала используйте Windows XP или новее. Мобильные приложения доступны для актуальных iOS и Android.",
    },
  };

  const { t, tm, locale } = useI18n();
  const mt4Ref = ref<HTMLElement | null>(null);

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const isMobilePage = computed(() => props.mode === "mobile");
  const pageTitle = computed(() => (isMobilePage.value ? pageCopy.value.mobileTitle : pageCopy.value.desktopTitle));
  const pageSubtitle = computed(() =>
    isMobilePage.value ? pageCopy.value.mobileSubtitle : pageCopy.value.desktopSubtitle
  );
  const currentMeta = computed(() => (isMobilePage.value ? pageCopy.value.mobileMeta : pageCopy.value.desktopMeta));
  const primarySection = computed(() => (isMobilePage.value ? pageCopy.value.mobile : pageCopy.value.desktop));
  const secondarySections = computed(() => (isMobilePage.value ? [pageCopy.value.desktop] : [pageCopy.value.mobile]));
  const requirementsText = computed(
    () => `${t("landing.pages.trading.mt4_requirements_text")} ${pageCopy.value.requirementsSuffix}`
  );

  const mt4Features = computed(() => {
    const features = tm("landing.pages.trading.mt4_features") as any[];
    return Array.isArray(features) ? features.map((_, index) => t(`landing.pages.trading.mt4_features[${index}]`)) : [];
  });

  const updatePointerOffset = (x = 0, y = 0) => {
    mt4Ref.value?.style.setProperty("--mt4-orb-x", `${x}px`);
    mt4Ref.value?.style.setProperty("--mt4-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = mt4Ref.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;

    updatePointerOffset(x, y);
  };

  const resetPointer = () => {
    updatePointerOffset();
  };

  const localizedPath = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return locale.value ? `/${locale.value}${normalizedPath}` : normalizedPath;
  };
</script>

<style lang="scss" scoped>
  .mt4-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --mt4-orb-x: 0px;
    --mt4-orb-y: 0px;
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

    &__number {
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

    &__button {
      grid-column: 2;
      justify-self: start;
      min-width: 196px;
      margin-top: 10px;
      border-radius: 14px;
      background: var(--landing-accent);
      color: white;
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

  .mt4-number {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 66px;
    border: 0;
    border-radius: 18px;
    overflow: visible;
    isolation: isolate;
    background: transparent;
    box-shadow: none;

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    }

    &::before {
      z-index: 1;
      border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 58%, transparent);
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--landing-surface-elevated) 27%, transparent),
        color-mix(in srgb, var(--landing-surface-elevated) 17%, transparent)
      );
      backdrop-filter: blur(16px) saturate(145%);
      -webkit-backdrop-filter: blur(16px) saturate(145%);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 28%, transparent),
        inset 0 -16px 24px color-mix(in srgb, var(--landing-accent) 8%, transparent);
    }

    &::after {
      z-index: 2;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.01)),
        linear-gradient(145deg, transparent, color-mix(in srgb, var(--landing-accent) 4%, transparent));
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 22%, transparent),
        inset 0 -16px 24px color-mix(in srgb, var(--landing-accent) 7%, transparent);
    }

    &__orb {
      position: absolute;
      pointer-events: none;
      border-radius: 999px;
      transform: translate(var(--mt4-orb-x), var(--mt4-orb-y));
      transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    &__orb--solid {
      z-index: 0;
      width: 31px;
      height: 31px;
      top: -8px;
      right: -10px;
      background: linear-gradient(145deg, #1b63ff 0%, #4d86ff 100%);
    }

    &__orb--glow {
      z-index: 0;
      width: 22px;
      height: 22px;
      top: 8px;
      right: 5px;
      background: radial-gradient(circle, rgba(142, 181, 255, 0.95) 0%, rgba(60, 122, 255, 0.62) 44%, transparent 72%);
      filter: blur(3px);
    }

    &__value {
      position: relative;
      z-index: 3;
      color: var(--landing-accent);
      font-size: 32px;
      font-weight: 500;
      line-height: 1;
    }
  }

  :global(:root[data-theme="dark"] .mt4-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
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

    &__number {
      width: 54px;
      height: 54px;
      border-radius: 15px;

      .mt4-number__value {
        font-size: 26px;
      }
    }
  }

  .mt4-compare {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 26px;
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(34px, 4vw, 54px);

    article {
      max-width: 720px;
    }

    &__eyebrow {
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

    a {
      display: inline-flex;
      margin-top: 18px;
      color: var(--landing-accent);
      font-size: 15px;
      font-weight: 900;
      text-decoration: none;

      &:hover {
        color: var(--landing-accent-hover);
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
    .mt4-details {
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

    .mt4-showcase__button {
      grid-column: 1;
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
