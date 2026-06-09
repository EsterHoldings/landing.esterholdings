<template>
  <UiContainer>
    <section
      ref="documentsRef"
      class="documents-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <header class="documents-hero">
        <span class="documents-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>
          {{ t("landing.pages.company.documents.title") }}
        </h1>

        <p>
          {{ t("landing.pages.company.documents.intro") }}
        </p>

        <div class="documents-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <div class="documents-grid">
        <article class="document-card document-card--primary">
          <div class="document-card__top">
            <span
              class="document-card__icon"
              data-symbol="REG" />
            <div>
              <h2>
                {{ t("landing.pages.company.documents.regulations_title") }}
              </h2>

              <p>
                {{ t("landing.pages.company.documents.regulations_subtitle") }}
              </p>
            </div>
          </div>

          <ul class="document-card__list">
            <li
              v-for="item in regulationsList"
              :key="item">
              <span class="document-card__check" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>

        <article class="document-card">
          <div class="document-card__top">
            <span
              class="document-card__icon"
              data-symbol="PDF" />
            <div>
              <h2>
                {{ t("landing.pages.company.documents.contract_title") }}
              </h2>

              <p>
                {{ t("landing.pages.company.documents.contract_description") }}
              </p>
            </div>
          </div>

          <div class="document-card__facts">
            <span
              v-for="item in pageCopy.contractFacts"
              :key="item">
              {{ item }}
            </span>
          </div>

          <UiButtonDefault
            state="primary"
            class="document-card__button"
            @click="handleClickContract">
            {{ t("landing.pages.company.documents.button") }}
          </UiButtonDefault>
        </article>
      </div>

      <section class="documents-process">
        <div class="documents-process__intro">
          <span>{{ pageCopy.processEyebrow }}</span>
          <h2>{{ pageCopy.processTitle }}</h2>
          <p>{{ pageCopy.processText }}</p>
        </div>

        <ol class="documents-process__steps">
          <li
            v-for="(step, index) in pageCopy.steps"
            :key="step.title">
            <span
              class="document-number documents-process__number"
              :class="`document-number--${index + 1}`">
              <span class="document-number__orb document-number__orb--solid" />
              <span class="document-number__orb document-number__orb--glow" />
              <span class="document-number__value">{{ index + 1 }}</span>
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
  import { definePageMeta } from "~/.nuxt/imports";
  import { useI18n } from "vue-i18n";
  import { computed, ref } from "vue";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";

  definePageMeta({
    layout: "main",
    alias: "/documents",
  });

  type DocumentsPageCopy = {
    eyebrow: string;
    meta: string[];
    contractFacts: string[];
    processEyebrow: string;
    processTitle: string;
    processText: string;
    steps: Array<{
      title: string;
      text: string;
    }>;
  };

  const localizedCopy: Record<string, DocumentsPageCopy> = {
    en: {
      eyebrow: "Legal documents",
      meta: ["Client agreement", "Trading rules", "Operational procedures"],
      contractFacts: ["Rights and obligations", "Funding and withdrawals", "Support communication"],
      processEyebrow: "How to use the documents",
      processTitle: "Keep the key rules close before you start",
      processText:
        "The documents help you quickly verify account terms, trading operations and how support requests are handled.",
      steps: [
        {
          title: "Review the regulations",
          text: "Check position opening rules, margin requirements and order execution details.",
        },
        {
          title: "Match contract terms",
          text: "Review the rights, obligations and interaction rules between the client and the company.",
        },
        {
          title: "Contact support",
          text: "If you need clarification, create a request in your cabinet or contact the support team.",
        },
      ],
    },
    uk: {
      eyebrow: "Юридична база",
      meta: ["Клієнтська угода", "Торгові правила", "Операційні процедури"],
      contractFacts: ["Права та обов'язки сторін", "Фінансові операції", "Комунікація та підтримка"],
      processEyebrow: "Як користуватися документами",
      processTitle: "Збережіть основні правила перед початком роботи",
      processText:
        "Документи допомагають швидко перевірити умови рахунку, порядок торгових операцій і сценарії звернення до підтримки.",
      steps: [
        {
          title: "Перегляньте регламент",
          text: "Зверніть увагу на правила відкриття позицій, маржинальні вимоги та виконання ордерів.",
        },
        {
          title: "Звірте умови договору",
          text: "Перевірте права, обов'язки та порядок взаємодії між клієнтом і компанією.",
        },
        {
          title: "Звертайтесь до підтримки",
          text: "Якщо потрібне уточнення, створіть звернення в кабінеті або напишіть команді підтримки.",
        },
      ],
    },
    ru: {
      eyebrow: "Юридическая база",
      meta: ["Клиентское соглашение", "Торговые правила", "Операционные процедуры"],
      contractFacts: ["Права и обязанности сторон", "Финансовые операции", "Коммуникация и поддержка"],
      processEyebrow: "Как пользоваться документами",
      processTitle: "Держите основные правила под рукой перед началом работы",
      processText:
        "Документы помогают быстро проверить условия счета, порядок торговых операций и сценарии обращения в поддержку.",
      steps: [
        {
          title: "Изучите регламент",
          text: "Проверьте правила открытия позиций, маржинальные требования и детали исполнения ордеров.",
        },
        {
          title: "Сверьте условия договора",
          text: "Посмотрите права, обязанности и порядок взаимодействия между клиентом и компанией.",
        },
        {
          title: "Обращайтесь в поддержку",
          text: "Если нужно уточнение, создайте обращение в кабинете или напишите команде поддержки.",
        },
      ],
    },
  };

  const { t, tm, locale } = useI18n();
  const documentsRef = ref<HTMLElement | null>(null);

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const regulationsList = computed(() => {
    const list = tm("landing.pages.company.documents.regulations_list") as any[];
    return Array.isArray(list)
      ? list.map((_, index) => t(`landing.pages.company.documents.regulations_list[${index}]`))
      : [];
  });

  const updatePointerOffset = (x = 0, y = 0) => {
    documentsRef.value?.style.setProperty("--documents-orb-x", `${x}px`);
    documentsRef.value?.style.setProperty("--documents-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = documentsRef.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;

    updatePointerOffset(x, y);
  };

  const resetPointer = () => {
    updatePointerOffset();
  };

  const handleClickContract = () => {
    const url = "https://esterholdings.com/wp-content/uploads/ESTER-HOLDINGS-INC_PUBLIC_OFFER_2024_EN.pdf";
    window.open(url, "_blank", "noopener,noreferrer");
  };
</script>

<style lang="scss" scoped>
  .documents-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --documents-orb-x: 0px;
    --documents-orb-y: 0px;
    color: var(--landing-text-primary);
  }

  .documents-hero {
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

  .documents-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.14fr) minmax(320px, 0.86fr);
    gap: clamp(48px, 6vw, 96px);
    align-items: start;
  }

  .document-card,
  .documents-process {
    position: relative;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .document-card {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0;

    &--primary {
      background: transparent;
    }

    &__top {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 20px;
      align-items: flex-start;
    }

    &__index {
      flex: 0 0 auto;
    }

    &__icon {
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

    h2 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: clamp(24px, 2.4vw, 34px);
      font-weight: 600;
      line-height: 1.12;
      text-transform: none;
    }

    p {
      margin: 12px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.55;
    }

    &__list {
      display: grid;
      gap: 15px;
      margin: 30px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: 26px minmax(0, 1fr);
        gap: 14px;
        align-items: start;
        color: var(--landing-text-primary);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.45;
      }
    }

    &__check {
      position: relative;
      width: 22px;
      height: 22px;
      margin-top: 1px;
      border: 1px solid color-mix(in srgb, var(--landing-accent) 72%, var(--landing-line));
      border-radius: 50%;
      background: color-mix(in srgb, var(--landing-accent) 13%, transparent);

      &::after {
        content: "";
        position: absolute;
        top: 5px;
        left: 7px;
        width: 6px;
        height: 10px;
        border-right: 2px solid var(--landing-accent);
        border-bottom: 2px solid var(--landing-accent);
        transform: rotate(45deg);
      }
    }

    &__facts {
      display: grid;
      gap: 10px;
      margin: 30px 0 28px;

      span {
        border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
        padding-bottom: 10px;
        color: var(--landing-text-primary);
        font-size: 16px;
        font-weight: 800;
      }
    }

    &__button {
      align-self: flex-start;
      margin-top: auto;
      min-width: 180px;
      border-radius: 14px;
      background: var(--landing-accent);
      color: white;
    }
  }

  .document-number {
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
      transform: translate(var(--documents-orb-x), var(--documents-orb-y));
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

  :global(:root[data-theme="dark"] .document-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .documents-process {
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

        > span {
          margin-top: 2px;
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
    .documents-page {
      gap: 32px;
    }

    .documents-grid,
    .documents-process {
      grid-template-columns: 1fr;
    }

    .document-card {
      min-height: auto;
    }
  }

  @media (max-width: 575px) {
    .documents-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .documents-process {
      padding-top: 32px;
    }

    .document-card__top,
    .documents-process__steps li {
      grid-template-columns: 1fr;
    }

    .document-card__top {
      display: grid;
    }
  }
</style>
