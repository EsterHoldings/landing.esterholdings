<template>
  <UiContainer>
    <section class="contacts-page">
      <header class="contacts-hero">
        <span class="contacts-hero__eyebrow">{{ pageCopy.eyebrow }}</span>
        <h1>{{ t("landing.pages.company.contacts.title") }}</h1>
        <p>{{ pageCopy.intro }}</p>

        <div class="contacts-hero__meta">
          <span
            v-for="item in pageCopy.meta"
            :key="item">
            {{ item }}
          </span>
        </div>
      </header>

      <section class="contacts-grid">
        <article class="contacts-office">
          <span>{{ t("landing.pages.company.contacts.office_title") }}</span>
          <h2>{{ t("landing.pages.company.contacts.office_name") }}</h2>
          <p>{{ t("landing.pages.company.contacts.office_address") }}</p>
          <strong>{{ t("landing.pages.company.contacts.office_registration") }}</strong>
        </article>

        <div class="contacts-channels">
          <a
            v-for="(channel, index) in channels"
            :key="channel.email"
            :href="`mailto:${channel.email}`"
            class="contacts-channel">
            <span
              class="contacts-icon"
              :data-symbol="channel.symbol" />
            <span class="contacts-channel__body">
              <span class="contacts-channel__label">{{ channel.label }}</span>
              <strong>{{ channel.email }}</strong>
            </span>
          </a>
        </div>
      </section>

      <section class="contacts-process">
        <div class="contacts-process__intro">
          <span>{{ pageCopy.processEyebrow }}</span>
          <h2>{{ pageCopy.processTitle }}</h2>
          <p>{{ pageCopy.processText }}</p>
        </div>

        <ol class="contacts-process__steps">
          <li
            v-for="(step, index) in pageCopy.steps"
            :key="step.title">
            <span
              class="contacts-icon contacts-process__icon"
              :data-symbol="pageCopy.stepSymbols[index]" />
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
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import { definePageMeta } from "~/.nuxt/imports";
  import UiContainer from "~/components/ui/UiContainer.vue";

  definePageMeta({
    layout: "main",
    alias: "/contacts",
  });

  type ContactsPageCopy = {
    eyebrow: string;
    intro: string;
    meta: string[];
    processEyebrow: string;
    processTitle: string;
    processText: string;
    stepSymbols: string[];
    steps: Array<{ title: string; text: string }>;
  };

  const localizedCopy: Record<string, ContactsPageCopy> = {
    en: {
      eyebrow: "Contact Ester",
      intro: "Choose the right team for operational questions, financial requests and partnership communication.",
      meta: ["Technical support", "Finance", "Marketing"],
      processEyebrow: "Before you write",
      processTitle: "Route the request to the right team",
      processText: "The correct channel helps the team process your request faster and keep the answer precise.",
      stepSymbols: ["SUP", "$", "PR"],
      steps: [
        {
          title: "Use support for platform questions",
          text: "Login, cabinet, verification and terminal access questions should go to the support team.",
        },
        {
          title: "Use finance for money operations",
          text: "Funding, withdrawal and payment clarification requests should be sent to the financial service.",
        },
        {
          title: "Use marketing for business requests",
          text: "Partnership, media and brand communication should be routed to the marketing team.",
        },
      ],
    },
    uk: {
      eyebrow: "Зв'язок з Ester",
      intro: "Оберіть потрібну команду для операційних питань, фінансових запитів і партнерської комунікації.",
      meta: ["Технічна підтримка", "Фінанси", "Маркетинг"],
      processEyebrow: "Перед зверненням",
      processTitle: "Спрямуйте запит у правильну команду",
      processText: "Правильний канал допомагає швидше обробити звернення та дати точну відповідь.",
      stepSymbols: ["SUP", "$", "PR"],
      steps: [
        {
          title: "Підтримка для питань платформи",
          text: "Логін, кабінет, верифікація та доступ до терміналу надсилайте команді підтримки.",
        },
        {
          title: "Фінанси для грошових операцій",
          text: "Поповнення, виведення коштів і уточнення платежів надсилайте фінансовій службі.",
        },
        {
          title: "Маркетинг для бізнес-запитів",
          text: "Партнерство, медіа та бренд-комунікацію спрямовуйте до маркетингової команди.",
        },
      ],
    },
    ru: {
      eyebrow: "Связь с Ester",
      intro: "Выберите нужную команду для операционных вопросов, финансовых запросов и партнерской коммуникации.",
      meta: ["Техническая поддержка", "Финансы", "Маркетинг"],
      processEyebrow: "Перед обращением",
      processTitle: "Направьте запрос в правильную команду",
      processText: "Правильный канал помогает быстрее обработать обращение и дать точный ответ.",
      stepSymbols: ["SUP", "$", "PR"],
      steps: [
        {
          title: "Поддержка для вопросов платформы",
          text: "Логин, кабинет, верификация и доступ к терминалу отправляйте команде поддержки.",
        },
        {
          title: "Финансы для денежных операций",
          text: "Пополнения, выводы и уточнения платежей отправляйте финансовой службе.",
        },
        {
          title: "Маркетинг для бизнес-запросов",
          text: "Партнерство, медиа и бренд-коммуникацию направляйте маркетинговой команде.",
        },
      ],
    },
  };

  const { t, locale } = useI18n();

  const pageCopy = computed(() => {
    const language = locale.value.split("-")[0];
    return localizedCopy[language] ?? localizedCopy.en;
  });

  const cleanEmail = (value: string) => value.replace("{'@'}", "@");

  const channels = computed(() => [
    {
      label: t("landing.pages.company.contacts.support_label"),
      email: cleanEmail(t("landing.pages.company.contacts.support_email")),
      symbol: "SUP",
    },
    {
      label: t("landing.pages.company.contacts.finance_label"),
      email: cleanEmail(t("landing.pages.company.contacts.finance_email")),
      symbol: "$",
    },
    {
      label: t("landing.pages.company.contacts.marketing_label"),
      email: cleanEmail(t("landing.pages.company.contacts.marketing_email")),
      symbol: "PR",
    },
  ]);
</script>

<style lang="scss" scoped>
  .contacts-page {
    display: flex;
    flex-direction: column;
    gap: clamp(52px, 6vw, 86px);
    color: var(--landing-text-primary);
  }

  .contacts-hero {
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

  .contacts-icon {
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

  .contacts-grid {
    display: grid;
    grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1.18fr);
    gap: clamp(40px, 5vw, 86px);
    align-items: start;
  }

  .contacts-office {
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

    strong {
      display: block;
      margin-top: 18px;
      color: var(--landing-text-primary);
      font-size: 15px;
      line-height: 1.35;
    }
  }

  .contacts-channels {
    display: grid;
    gap: 14px;
  }

  .contacts-channel {
    display: grid;
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    border-bottom: 1px solid color-mix(in srgb, var(--landing-line) 70%, transparent);
    padding-bottom: 16px;
    color: inherit;
    text-decoration: none;

    &:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    &__label {
      display: block;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.35;
    }

    strong {
      display: block;
      margin-top: 6px;
      color: var(--landing-text-primary);
      font-size: clamp(18px, 2vw, 25px);
      font-weight: 700;
      line-height: 1.18;
      word-break: break-word;
      transition: color 0.2s ease;
    }

    &:hover strong {
      color: var(--landing-accent);
    }
  }

  .contacts-number {
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
      transform: translate(var(--contacts-orb-x), var(--contacts-orb-y));
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

  :global(:root[data-theme="dark"] .contacts-number::before) {
    border-color: rgba(139, 164, 214, 0.36);
    background: linear-gradient(145deg, rgba(25, 48, 96, 0.27) 0%, rgba(8, 23, 55, 0.19) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -16px 24px rgba(0, 81, 255, 0.08);
  }

  .contacts-process {
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
    .contacts-page {
      gap: 32px;
    }

    .contacts-grid,
    .contacts-process {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 575px) {
    .contacts-hero {
      text-align: left;

      &__meta {
        justify-content: flex-start;
      }
    }

    .contacts-channel,
    .contacts-process__steps li {
      grid-template-columns: 1fr;
    }
  }
</style>
