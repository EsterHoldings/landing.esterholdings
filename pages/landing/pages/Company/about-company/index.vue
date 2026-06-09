<template>
  <UiContainer>
    <section
      ref="aboutRef"
      class="about-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <header class="about-hero">
        <span class="about-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ t("landing.pages.company.about.title") }}</h1>
        <p>
          <strong>{{ t("landing.pages.company.about.intro_1.highlight") }}</strong>
          {{ t("landing.pages.company.about.intro_1.text") }}
        </p>

        <div class="about-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <section class="about-story">
        <div class="about-story__copy">
          <span>{{ pageCopy.storyEyebrow }}</span>
          <h2>{{ pageCopy.storyTitle }}</h2>
          <p>{{ t("landing.pages.company.about.intro_2") }}</p>
          <p>
            <strong>{{ t("landing.pages.company.about.intro_3") }}</strong>
          </p>
          <p>{{ t("landing.pages.company.about.intro_4") }}</p>
          <p>
            <strong>{{ t("landing.pages.company.about.intro_5.highlight") }}</strong>
            {{ t("landing.pages.company.about.intro_5.text") }}
          </p>
        </div>

        <div class="about-principles">
          <article
            v-for="(item, index) in pageCopy.principles"
            :key="item.title">
            <span
              class="about-number"
              :class="`about-number--${index + 1}`">
              <span class="about-number__orb about-number__orb--solid" />
              <span class="about-number__orb about-number__orb--glow" />
              <span class="about-number__value">{{ index + 1 }}</span>
            </span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="about-flow-section">
        <div class="about-flow-section__intro">
          <span>{{ t("landing.pages.company.about.business_model_title") }}</span>
          <h2>{{ pageCopy.flowTitle }}</h2>
          <p>{{ t("landing.pages.company.about.business_model_subtitle") }}</p>
        </div>

        <div
          class="business-flow"
          aria-label="Ester business model">
          <div class="business-flow__column business-flow__column--left">
            <article class="flow-node flow-node--bank">
              <span class="flow-node__icon flow-node__icon--bank" />
              <div>
                <h3>{{ pageCopy.flow.ecn }}</h3>
                <p>{{ pageCopy.flow.banks }}</p>
              </div>
            </article>

            <span class="flow-chip flow-chip--price">
              {{ pageCopy.flow.prices }}
              <span>↓</span>
            </span>

            <article class="flow-node flow-node--chart">
              <span class="flow-node__icon flow-node__icon--chart" />
              <div>
                <h3>{{ pageCopy.flow.integration }}</h3>
                <p>{{ businessModelList[0] }}</p>
              </div>
            </article>

            <span class="flow-chip flow-chip--price">
              {{ pageCopy.flow.prices }}
              <span>↓</span>
            </span>

            <article class="flow-node flow-node--customers">
              <span class="flow-node__icon flow-node__icon--network" />
              <div>
                <h3>{{ pageCopy.flow.customers }}</h3>
                <p>{{ businessModelList[1] }}</p>
              </div>
            </article>
          </div>

          <div class="business-flow__connector">
            <span />
            <span />
          </div>

          <div class="business-flow__column business-flow__column--right">
            <span class="flow-chip flow-chip--order">
              <span>↑</span>
              {{ pageCopy.flow.orders }}
            </span>

            <article class="flow-node flow-node--broker">
              <span class="flow-node__icon flow-node__icon--bank" />
              <div>
                <h3>{{ pageCopy.flow.broker }}</h3>
                <p>{{ businessModelList[3] }}</p>
              </div>
            </article>

            <span class="flow-chip flow-chip--order">
              <span>↑</span>
              {{ pageCopy.flow.orders }}
            </span>
          </div>
        </div>
      </section>

      <section class="about-activity">
        <div class="about-activity__intro">
          <span>{{ t("landing.pages.company.about.activity_title") }}</span>
          <h2>{{ pageCopy.activityTitle }}</h2>
          <p>{{ pageCopy.activityText }}</p>
        </div>

        <ul class="about-activity__list">
          <li
            v-for="(item, index) in activityList"
            :key="item">
            <span
              class="about-number about-activity__number"
              :class="`about-number--${index + 4}`">
              <span class="about-number__orb about-number__orb--solid" />
              <span class="about-number__orb about-number__orb--glow" />
              <span class="about-number__value">{{ index + 1 }}</span>
            </span>
            <span>{{ item }}</span>
          </li>
        </ul>
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
    alias: "/about-company",
  });

  type AboutPageCopy = {
    eyebrow: string;
    meta: string[];
    storyEyebrow: string;
    storyTitle: string;
    principles: Array<{ title: string; text: string }>;
    flowTitle: string;
    activityTitle: string;
    activityText: string;
    flow: {
      ecn: string;
      banks: string;
      prices: string;
      orders: string;
      integration: string;
      customers: string;
      broker: string;
    };
  };

  const localizedCopy: Record<string, AboutPageCopy> = {
    en: {
      eyebrow: "Company profile",
      meta: ["Financial holding", "Client-first service", "Transparent execution"],
      storyEyebrow: "How Ester works",
      storyTitle: "A financial company focused on stable client outcomes",
      principles: [
        {
          title: "Trading conditions",
          text: "Competitive terms and access to the tools traders expect in daily work.",
        },
        {
          title: "Service quality",
          text: "Operational support, analytics and knowledge are part of the same client workflow.",
        },
        {
          title: "Legal clarity",
          text: "The relationship with clients is built around clear documents and transparent procedures.",
        },
      ],
      flowTitle: "Transparent routing between liquidity and clients",
      activityTitle: "Services around the full trading process",
      activityText: "Ester combines market access, advisory support, analytics and education in one operating model.",
      flow: {
        ecn: "ECN platform",
        banks: "Banks and liquidity suppliers",
        prices: "Prices",
        orders: "Orders",
        integration: "Price aggregation",
        customers: "Customers",
        broker: "Prime Broker",
      },
    },
    uk: {
      eyebrow: "Профіль компанії",
      meta: ["Фінансовий холдинг", "Сервіс навколо клієнта", "Прозоре виконання"],
      storyEyebrow: "Як працює Ester",
      storyTitle: "Фінансова компанія, сфокусована на стабільному результаті клієнта",
      principles: [
        {
          title: "Торгові умови",
          text: "Конкурентні умови та доступ до інструментів, які потрібні трейдеру щодня.",
        },
        {
          title: "Якість сервісу",
          text: "Операційна підтримка, аналітика та знання працюють в одному клієнтському процесі.",
        },
        {
          title: "Юридична ясність",
          text: "Взаємодія з клієнтами будується навколо зрозумілих документів і прозорих процедур.",
        },
      ],
      flowTitle: "Прозорий маршрут між ліквідністю та клієнтами",
      activityTitle: "Сервіси навколо повного торгового процесу",
      activityText: "Ester поєднує доступ до ринку, консультаційну підтримку, аналітику та навчання в одній моделі.",
      flow: {
        ecn: "ECN-платформа",
        banks: "Банки та постачальники ліквідності",
        prices: "Ціни",
        orders: "Ордера",
        integration: "Агрегація цін",
        customers: "Клієнти",
        broker: "Prime Broker",
      },
    },
    ru: {
      eyebrow: "Профиль компании",
      meta: ["Финансовый холдинг", "Сервис вокруг клиента", "Прозрачное исполнение"],
      storyEyebrow: "Как работает Ester",
      storyTitle: "Финансовая компания, сфокусированная на стабильном результате клиента",
      principles: [
        {
          title: "Торговые условия",
          text: "Конкурентные условия и доступ к инструментам, которые нужны трейдеру ежедневно.",
        },
        {
          title: "Качество сервиса",
          text: "Операционная поддержка, аналитика и знания работают в одном клиентском процессе.",
        },
        {
          title: "Юридическая ясность",
          text: "Взаимодействие с клиентами строится вокруг понятных документов и прозрачных процедур.",
        },
      ],
      flowTitle: "Прозрачный маршрут между ликвидностью и клиентами",
      activityTitle: "Сервисы вокруг полного торгового процесса",
      activityText: "Ester объединяет доступ к рынку, консультационную поддержку, аналитику и обучение в одной модели.",
      flow: {
        ecn: "ECN-платформа",
        banks: "Банки и поставщики ликвидности",
        prices: "Цены",
        orders: "Ордера",
        integration: "Агрегация цен",
        customers: "Клиенты",
        broker: "Prime Broker",
      },
    },
  };

  const { t, tm, locale } = useI18n();
  const aboutRef = ref<HTMLElement | null>(null);

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const businessModelList = computed(() => {
    const list = tm("landing.pages.company.about.business_model_list") as any[];
    return Array.isArray(list)
      ? list.map((_, index) => t(`landing.pages.company.about.business_model_list[${index}]`))
      : [];
  });

  const activityList = computed(() => {
    const list = tm("landing.pages.company.about.activity_list") as any[];
    return Array.isArray(list) ? list.map((_, index) => t(`landing.pages.company.about.activity_list[${index}]`)) : [];
  });

  const updatePointerOffset = (x = 0, y = 0) => {
    aboutRef.value?.style.setProperty("--about-orb-x", `${x}px`);
    aboutRef.value?.style.setProperty("--about-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = aboutRef.value;
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
  .about-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --about-orb-x: 0px;
    --about-orb-y: 0px;
    color: var(--landing-text-primary);
  }

  .about-hero {
    max-width: 1000px;
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
      max-width: 820px;
      margin: 20px auto 0;
      color: var(--landing-text-secondary);
      font-size: clamp(17px, 1.4vw, 20px);
      font-weight: 600;
      line-height: 1.55;

      strong {
        color: var(--landing-text-primary);
      }
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

  .about-story {
    display: grid;
    grid-template-columns: minmax(320px, 0.88fr) minmax(0, 1.12fr);
    gap: clamp(42px, 5vw, 86px);
    align-items: start;

    &__copy {
      span {
        color: var(--landing-accent);
        font-size: 13px;
        font-weight: 900;
        text-transform: uppercase;
      }

      h2 {
        margin: 12px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(30px, 3.2vw, 46px);
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
          color: var(--landing-text-primary);
        }
      }
    }
  }

  .about-principles {
    display: grid;
    gap: 18px;

    article {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 16px;
      align-items: start;
      border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
      padding-bottom: 18px;

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }

    h3 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 20px;
      font-weight: 800;
      line-height: 1.2;
    }

    p {
      margin: 8px 0 0;
      color: var(--landing-text-secondary);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .about-number {
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
      transform: translate(var(--about-orb-x), var(--about-orb-y));
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

  :global(:root[data-theme="dark"] .about-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .about-flow-section {
    display: grid;
    grid-template-columns: minmax(280px, 0.52fr) minmax(0, 1.48fr);
    gap: clamp(34px, 5vw, 70px);
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(38px, 4vw, 58px);

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
  }

  .business-flow {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 120px minmax(220px, 0.72fr);
    gap: 20px;
    align-items: center;

    &__column {
      display: grid;
      gap: 18px;
    }

    &__column--right {
      align-content: center;
    }

    &__connector {
      position: relative;
      align-self: stretch;
      min-height: 330px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        width: 92px;
        border-top: 1px dashed color-mix(in srgb, var(--landing-line) 82%, transparent);
      }

      &::before {
        top: 24%;
        transform: translateX(-50%);
      }

      &::after {
        bottom: 24%;
        transform: translateX(-50%);
      }

      span {
        position: absolute;
        left: 50%;
        width: 1px;
        height: 42%;
        border-left: 1px dashed color-mix(in srgb, var(--landing-line) 82%, transparent);
        transform: translateX(-50%);

        &:first-child {
          top: 24%;
        }

        &:last-child {
          bottom: 24%;
        }
      }
    }
  }

  .flow-node {
    display: grid;
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    min-height: 118px;

    h3 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(20px, 1.8vw, 28px);
      font-weight: 700;
      line-height: 1.12;
    }

    p {
      margin: 8px 0 0;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.45;
    }

    &__icon {
      position: relative;
      display: block;
      width: 66px;
      height: 66px;
      color: var(--landing-accent);
    }

    &__icon--bank {
      border-bottom: 7px solid currentColor;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 3px;
        margin: auto;
        width: 56px;
        height: 18px;
        background: currentColor;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
      }

      &::after {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        top: 26px;
        height: 28px;
        background: repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px);
      }
    }

    &__icon--chart {
      &::before {
        content: "";
        position: absolute;
        inset: 16px 10px 8px;
        background:
          linear-gradient(currentColor, currentColor) 0 100% / 10px 28px no-repeat,
          linear-gradient(currentColor, currentColor) 22px 100% / 10px 44px no-repeat,
          linear-gradient(currentColor, currentColor) 44px 100% / 10px 34px no-repeat;
      }

      &::after {
        content: "";
        position: absolute;
        left: 8px;
        top: 14px;
        width: 50px;
        height: 30px;
        border-left: 6px solid currentColor;
        border-top: 6px solid currentColor;
        transform: skewY(-24deg) rotate(6deg);
      }
    }

    &__icon--network {
      &::before {
        content: "";
        position: absolute;
        inset: 10px;
        border-radius: 50%;
        border: 2px dotted color-mix(in srgb, var(--landing-accent) 70%, transparent);
      }

      &::after {
        content: "";
        position: absolute;
        inset: 20px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 18% 35%, currentColor 0 4px, transparent 5px),
          radial-gradient(circle at 48% 20%, currentColor 0 4px, transparent 5px),
          radial-gradient(circle at 76% 48%, currentColor 0 4px, transparent 5px),
          radial-gradient(circle at 38% 74%, currentColor 0 4px, transparent 5px);
      }
    }
  }

  .flow-chip {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 102px;
    min-height: 52px;
    border: 1px dashed color-mix(in srgb, var(--landing-accent-secondary) 64%, transparent);
    border-radius: 999px;
    color: var(--landing-accent-secondary);
    font-size: 13px;
    font-weight: 900;
    line-height: 1.1;
    text-transform: uppercase;

    span {
      font-size: 19px;
      line-height: 1;
    }
  }

  .about-activity {
    display: grid;
    grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
    gap: 34px;
    border-top: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-top: clamp(38px, 4vw, 58px);

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
  }

  @media (max-width: 991px) {
    .about-page {
      gap: 32px;
    }

    .about-story,
    .about-flow-section,
    .about-activity {
      grid-template-columns: 1fr;
    }

    .business-flow {
      grid-template-columns: 1fr;
    }

    .business-flow__connector {
      display: none;
    }
  }

  @media (max-width: 575px) {
    .about-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .about-principles article,
    .about-activity__list li {
      grid-template-columns: 1fr;
    }

    .flow-node {
      grid-template-columns: 1fr;
      min-height: 0;
    }
  }
</style>
