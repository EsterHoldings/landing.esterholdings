<template>
  <UiContainer>
    <section
      ref="marketNewsRef"
      class="market-news-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <header class="market-news-hero">
        <span class="market-news-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ t("landing.pages.trading.market_news_title") }}</h1>
        <p>{{ pageCopy.intro }}</p>

        <div class="market-news-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <section
        id="market-news-stream"
        class="market-news-stream">
        <article
          v-for="(card, index) in newsItems"
          :key="card.title"
          class="market-news-item">
          <span
            class="market-number market-news-item__number"
            :class="`market-number--${index + 1}`">
            <span class="market-number__orb market-number__orb--solid" />
            <span class="market-number__orb market-number__orb--glow" />
            <span class="market-number__value">{{ index + 1 }}</span>
          </span>

          <div class="market-news-item__body">
            <span class="market-news-item__date">{{ card.time }}</span>
            <h2>{{ card.title }}</h2>
            <p>{{ card.subTitle }}</p>

            <NuxtLink
              :to="localizedPath(card.link)"
              class="market-news-item__link">
              {{ card.buttonText }}
              <span>→</span>
            </NuxtLink>
          </div>
        </article>
      </section>

      <section class="market-news-rhythm">
        <div class="market-news-rhythm__intro">
          <span>{{ pageCopy.rhythmEyebrow }}</span>
          <h2>{{ pageCopy.rhythmTitle }}</h2>
          <p>{{ pageCopy.rhythmText }}</p>
        </div>

        <ol class="market-news-rhythm__steps">
          <li
            v-for="(step, index) in pageCopy.steps"
            :key="step.title">
            <span
              class="market-number market-news-rhythm__number"
              :class="`market-number--${index + newsItems.length + 1}`">
              <span class="market-number__orb market-number__orb--solid" />
              <span class="market-number__orb market-number__orb--glow" />
              <span class="market-number__value">{{ index + 1 }}</span>
            </span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { definePageMeta } from "~/.nuxt/imports";
  import UiContainer from "~/components/ui/UiContainer.vue";

  definePageMeta({
    layout: "main",
    alias: "/market-news",
  });

  type MarketNewsPageCopy = {
    eyebrow: string;
    intro: string;
    meta: string[];
    rhythmEyebrow: string;
    rhythmTitle: string;
    rhythmText: string;
    steps: Array<{
      title: string;
      text: string;
    }>;
  };

  const localizedCopy: Record<string, MarketNewsPageCopy> = {
    en: {
      eyebrow: "Trader hub",
      intro: "A concise stream of market events, trading context and practical signals for planning the next session.",
      meta: ["Market context", "Risk focus", "Trading ideas"],
      rhythmEyebrow: "How to read the updates",
      rhythmTitle: "Use market news as a trading checklist",
      rhythmText:
        "The feed keeps the focus on what can influence spreads, volatility and timing, without turning market news into noise.",
      steps: [
        {
          title: "Check the session driver",
          text: "Start with the event or asset class that is currently shaping liquidity.",
        },
        {
          title: "Compare with your account plan",
          text: "Match the update with your risk limits, active positions and planned entry points.",
        },
        {
          title: "Act only when the setup is clear",
          text: "Use the news as context, not as a reason to open a trade without confirmation.",
        },
      ],
    },
    uk: {
      eyebrow: "Hub трейдера",
      intro:
        "Короткий потік ринкових подій, торгового контексту та практичних сигналів для планування наступної сесії.",
      meta: ["Контекст ринку", "Фокус на ризику", "Торгові ідеї"],
      rhythmEyebrow: "Як читати оновлення",
      rhythmTitle: "Використовуйте новини ринку як торговий чеклист",
      rhythmText:
        "Стрічка допомагає тримати фокус на тому, що може впливати на спреди, волатильність і вибір моменту для входу.",
      steps: [
        {
          title: "Перевірте драйвер сесії",
          text: "Почніть із події або класу активів, які зараз формують ліквідність.",
        },
        {
          title: "Зіставте з планом рахунку",
          text: "Порівняйте оновлення з вашими ризик-лімітами, відкритими позиціями та запланованими входами.",
        },
        {
          title: "Дійте лише за чіткого сетапу",
          text: "Використовуйте новини як контекст, а не як причину відкривати угоду без підтвердження.",
        },
      ],
    },
    ru: {
      eyebrow: "Hub трейдера",
      intro:
        "Короткая лента рыночных событий, торгового контекста и практических сигналов для планирования следующей сессии.",
      meta: ["Контекст рынка", "Фокус на риске", "Торговые идеи"],
      rhythmEyebrow: "Как читать обновления",
      rhythmTitle: "Используйте новости рынка как торговый чеклист",
      rhythmText:
        "Лента помогает держать фокус на том, что может влиять на спреды, волатильность и выбор момента для входа.",
      steps: [
        {
          title: "Проверьте драйвер сессии",
          text: "Начните с события или класса активов, которые сейчас формируют ликвидность.",
        },
        {
          title: "Сопоставьте с планом счета",
          text: "Сравните обновление с вашими риск-лимитами, открытыми позициями и запланированными входами.",
        },
        {
          title: "Действуйте только при четком сетапе",
          text: "Используйте новости как контекст, а не как причину открывать сделку без подтверждения.",
        },
      ],
    },
  };

  const { t, tm, locale } = useI18n();
  const marketNewsRef = ref<HTMLElement | null>(null);

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const newsItems = computed(() => {
    const items = tm("landing.pages.trading.market_news_items") as any[];
    const buttonText = t("landing.pages.company.news.button");

    return Array.isArray(items)
      ? items.map((_, index) => ({
          title: t(`landing.pages.trading.market_news_items[${index}].title`),
          subTitle: t(`landing.pages.trading.market_news_items[${index}].subtitle`),
          time: t(`landing.pages.trading.market_news_items[${index}].time`),
          link: "/trader-blog",
          buttonText,
        }))
      : [];
  });

  const localizedPath = (path: string) => {
    if (!path || path === "#") return "#";

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return locale.value ? `/${locale.value}${normalizedPath}` : normalizedPath;
  };

  const updatePointerOffset = (x = 0, y = 0) => {
    marketNewsRef.value?.style.setProperty("--market-orb-x", `${x}px`);
    marketNewsRef.value?.style.setProperty("--market-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = marketNewsRef.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;

    updatePointerOffset(x, y);
  };

  const resetPointer = () => {
    updatePointerOffset();
  };
</script>

<style lang="scss" scoped>
  .market-news-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --market-orb-x: 0px;
    --market-orb-y: 0px;
    color: var(--landing-text-primary);
  }

  .market-news-hero {
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

  .market-news-stream {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(34px, 4vw, 58px) clamp(44px, 5vw, 80px);
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(38px, 4vw, 58px);
  }

  .market-news-item {
    display: grid;
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 20px;
    align-items: flex-start;
    border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-bottom: clamp(28px, 3vw, 38px);

    &__date {
      display: inline-flex;
      margin-bottom: 12px;
      color: var(--landing-accent);
      font-size: 13px;
      font-weight: 900;
      line-height: 1.2;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(23px, 2vw, 32px);
      font-weight: 600;
      line-height: 1.12;
    }

    p {
      margin: 14px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.55;
    }

    &__link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 22px;
      color: var(--landing-accent);
      font-size: 15px;
      font-weight: 900;
      line-height: 1.2;
      text-decoration: none;

      span {
        transition: transform 0.2s ease;
      }

      &:hover span {
        transform: translateX(4px);
      }
    }
  }

  .market-number {
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
      transform: translate(var(--market-orb-x), var(--market-orb-y));
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

  :global(:root[data-theme="dark"] .market-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .market-news-rhythm {
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
        grid-template-columns: 76px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
        border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
        padding-bottom: 16px;

        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }

      h3 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 18px;
        font-weight: 800;
        line-height: 1.25;
      }

      p {
        margin: 7px 0 0;
        color: var(--landing-text-secondary);
        font-size: 15px;
        font-weight: 600;
        line-height: 1.5;
      }
    }
  }

  @media (max-width: 991px) {
    .market-news-page {
      gap: 32px;
    }

    .market-news-stream,
    .market-news-rhythm {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 575px) {
    .market-news-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .market-news-stream {
      padding-top: 32px;
    }

    .market-news-item,
    .market-news-rhythm__steps li {
      grid-template-columns: 1fr;
    }
  }
</style>
