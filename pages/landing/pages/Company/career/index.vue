<template>
  <UiContainer>
    <section
      ref="careerRef"
      class="career-page"
      @pointermove="handlePointerMove"
      @pointerleave="resetPointer">
      <header class="career-hero">
        <span class="career-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ t("landing.pages.company.career.title") }}</h1>
        <p>{{ pageCopy.intro }}</p>

        <div class="career-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <section class="career-openings">
        <div class="career-openings__intro">
          <span>{{ pageCopy.openingsEyebrow }}</span>
          <h2>{{ t("landing.pages.company.career.subtitle") }}</h2>
          <p>{{ pageCopy.openingsText }}</p>
        </div>

        <ul class="career-openings__list">
          <li
            v-for="(position, index) in positions"
            :key="position">
            <span
              class="career-number"
              :class="`career-number--${index + 1}`">
              <span class="career-number__orb career-number__orb--solid" />
              <span class="career-number__orb career-number__orb--glow" />
              <span class="career-number__value">{{ index + 1 }}</span>
            </span>
            <div>
              <h3>{{ position }}</h3>
              <p>{{ pageCopy.positionNotes[index] ?? pageCopy.positionFallback }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section class="career-cta">
        <div class="career-cta__intro">
          <span>{{ pageCopy.ctaEyebrow }}</span>
          <h2>{{ pageCopy.ctaTitle }}</h2>
          <p>{{ t("landing.pages.company.career.cta") }}</p>
        </div>

        <a
          :href="cvMailto"
          class="career-cta__button">
          {{ t("landing.pages.company.career.button") }}
          <span>→</span>
        </a>
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
    alias: "/career",
  });

  type CareerPageCopy = {
    eyebrow: string;
    intro: string;
    meta: string[];
    openingsEyebrow: string;
    openingsText: string;
    positionNotes: string[];
    positionFallback: string;
    ctaEyebrow: string;
    ctaTitle: string;
  };

  const localizedCopy: Record<string, CareerPageCopy> = {
    en: {
      eyebrow: "Join Ester",
      intro:
        "We are looking for people who can grow with a financial product, understand clients and work with discipline.",
      meta: ["Sales", "Analytics", "Client focus"],
      openingsEyebrow: "Open roles",
      openingsText:
        "The current roles are focused on client growth, market expertise and strong operational discipline.",
      positionNotes: [
        "Client communication, account onboarding and careful work with trading service requests.",
        "Market research, analytical materials and support for client-facing trading content.",
      ],
      positionFallback: "A role for specialists who can combine ownership, speed and accuracy.",
      ctaEyebrow: "Application",
      ctaTitle: "Send your CV and tell us where you can create value",
    },
    uk: {
      eyebrow: "Приєднуйтесь до Ester",
      intro:
        "Ми шукаємо людей, які можуть зростати з фінансовим продуктом, розуміти клієнтів і працювати дисципліновано.",
      meta: ["Продажі", "Аналітика", "Фокус на клієнті"],
      openingsEyebrow: "Відкриті ролі",
      openingsText:
        "Поточні ролі сфокусовані на розвитку клієнтів, ринковій експертизі та сильній операційній дисципліні.",
      positionNotes: [
        "Комунікація з клієнтами, супровід відкриття рахунків і уважна робота з торговими запитами.",
        "Ринкові дослідження, аналітичні матеріали та підтримка трейдерського контенту для клієнтів.",
      ],
      positionFallback: "Роль для спеціалістів, які поєднують відповідальність, швидкість і точність.",
      ctaEyebrow: "Відгук",
      ctaTitle: "Надішліть резюме та покажіть, де можете створювати цінність",
    },
    ru: {
      eyebrow: "Присоединяйтесь к Ester",
      intro:
        "Мы ищем людей, которые могут расти вместе с финансовым продуктом, понимать клиентов и работать дисциплинированно.",
      meta: ["Продажи", "Аналитика", "Фокус на клиенте"],
      openingsEyebrow: "Открытые роли",
      openingsText:
        "Текущие роли сфокусированы на развитии клиентов, рыночной экспертизе и сильной операционной дисциплине.",
      positionNotes: [
        "Коммуникация с клиентами, сопровождение открытия счетов и внимательная работа с торговыми запросами.",
        "Рыночные исследования, аналитические материалы и поддержка трейдерского контента для клиентов.",
      ],
      positionFallback: "Роль для специалистов, которые сочетают ответственность, скорость и точность.",
      ctaEyebrow: "Отклик",
      ctaTitle: "Отправьте резюме и покажите, где можете создавать ценность",
    },
  };

  const { t, tm, locale } = useI18n();
  const careerRef = ref<HTMLElement | null>(null);

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const positions = computed(() => {
    const list = tm("landing.pages.company.career.positions") as any[];
    return Array.isArray(list) ? list.map((_, index) => t(`landing.pages.company.career.positions[${index}]`)) : [];
  });

  const cvMailto = computed(() => {
    const subject = encodeURIComponent(`${t("landing.pages.company.career.title")} - CV`);
    return `mailto:marketing@esterholdings.com?subject=${subject}`;
  });

  const updatePointerOffset = (x = 0, y = 0) => {
    careerRef.value?.style.setProperty("--career-orb-x", `${x}px`);
    careerRef.value?.style.setProperty("--career-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = careerRef.value;
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
  .career-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    --career-orb-x: 0px;
    --career-orb-y: 0px;
    color: var(--landing-text-primary);
  }

  .career-hero {
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
      max-width: 780px;
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

  .career-openings {
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
        padding-bottom: 18px;

        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }

      h3 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: clamp(20px, 2vw, 28px);
        font-weight: 800;
        line-height: 1.18;
      }

      p {
        margin: 8px 0 0;
        color: var(--landing-text-secondary);
        font-size: 15px;
        font-weight: 600;
        line-height: 1.5;
      }
    }
  }

  .career-number {
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
      transform: translate(var(--career-orb-x), var(--career-orb-y));
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

  :global(:root[data-theme="dark"] .career-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .career-cta {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) auto;
    gap: 28px;
    align-items: end;
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
        max-width: 760px;
        margin: 12px 0 0;
        color: var(--landing-text-strong);
        font-size: clamp(28px, 3vw, 42px);
        font-weight: 500;
        line-height: 1.08;
      }

      p {
        max-width: 760px;
        margin: 16px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.55;
      }
    }

    &__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      min-width: 230px;
      min-height: 58px;
      border-radius: 16px;
      background: var(--landing-accent);
      color: white;
      font-size: 17px;
      font-weight: 900;
      line-height: 1.2;
      text-decoration: none;

      span {
        font-size: 28px;
        line-height: 1;
        transition: transform 0.2s ease;
      }

      &:hover span {
        transform: translateX(4px);
      }
    }
  }

  @media (max-width: 991px) {
    .career-page {
      gap: 32px;
    }

    .career-openings,
    .career-cta {
      grid-template-columns: 1fr;
    }

    .career-cta__button {
      justify-self: start;
    }
  }

  @media (max-width: 575px) {
    .career-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .career-openings__list li {
      grid-template-columns: 1fr;
    }

    .career-cta__button {
      width: 100%;
    }
  }
</style>
