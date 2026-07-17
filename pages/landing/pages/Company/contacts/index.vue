<template>
  <UiContainer>
    <main
      class="contacts-page"
      :dir="isRtl ? 'rtl' : 'ltr'">
      <section class="contacts-hero">
        <div
          class="contacts-hero__visual"
          aria-hidden="true">
          <img
            src="/static/contacts/hero.png"
            alt=""
            width="933"
            height="658" />
        </div>

        <div class="contacts-hero__copy">
          <p class="contacts-eyebrow">
            {{ t("landing.pages.company.contacts.eyebrow") }}
          </p>

          <h1>{{ t("landing.pages.company.contacts.title") }}</h1>

          <p class="contacts-hero__intro">
            {{ t("landing.pages.company.contacts.intro") }}
          </p>
        </div>

        <ul class="contacts-hero__links">
          <li
            v-for="(item, index) in heroLinks"
            :key="item">
            <img
              :src="heroLinkIcons[index]"
              alt=""
              width="24"
              height="24" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <section class="contacts-office-section">
        <article class="contacts-office">
          <p class="contacts-eyebrow">
            {{ t("landing.pages.company.contacts.office_title") }}
          </p>
          <h2>{{ t("landing.pages.company.contacts.office_name") }}</h2>
          <p class="contacts-office__address">
            {{ t("landing.pages.company.contacts.office_address") }}
          </p>
          <strong>{{ t("landing.pages.company.contacts.office_registration") }}</strong>
        </article>

        <div class="contacts-channels">
          <a
            v-for="channel in channels"
            :key="channel.email"
            :href="`mailto:${channel.email}`"
            class="contacts-channel">
            <span class="contacts-channel__label">{{ channel.label }}</span>
            <span class="contacts-channel__email">{{ channel.email }}</span>
          </a>
        </div>
      </section>

      <section class="contacts-process">
        <div class="contacts-process__intro">
          <p class="contacts-eyebrow">
            {{ t("landing.pages.company.contacts.process_eyebrow") }}
          </p>
          <h2>{{ t("landing.pages.company.contacts.process_title") }}</h2>
          <p>{{ t("landing.pages.company.contacts.process_text") }}</p>
        </div>

        <ol class="contacts-process__steps">
          <li
            v-for="(step, index) in processSteps"
            :key="step.title">
            <img
              :src="processIcons[index]"
              alt=""
              width="50"
              height="50" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
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

  type ProcessStep = {
    title: string;
    text: string;
  };

  const { t, tm, locale } = useI18n();

  const heroLinkIcons = [
    "/static/contacts/icon-technical-support.svg",
    "/static/contacts/icon-finance.svg",
    "/static/contacts/icon-marketing.svg",
  ];

  const processIcons = [
    "/static/contacts/icon-support-route.svg",
    "/static/contacts/icon-finance-route.svg",
    "/static/contacts/icon-marketing-route.svg",
  ];

  const isRtl = computed(() => locale.value.split("-")[0] === "he");

  const getTranslatedList = (key: string) => {
    const list = tm(key) as unknown[];
    return Array.isArray(list) ? list.map((_, index) => t(`${key}[${index}]`)) : [];
  };

  const heroLinks = computed(() => getTranslatedList("landing.pages.company.contacts.hero_links"));

  const processSteps = computed<ProcessStep[]>(() => {
    const key = "landing.pages.company.contacts.process_steps";
    const steps = tm(key) as unknown[];

    if (!Array.isArray(steps)) return [];

    return steps.map((_, index) => ({
      title: t(`${key}[${index}].title`),
      text: t(`${key}[${index}].text`),
    }));
  });

  const cleanEmail = (value: string) => value.replace("{'@'}", "@");

  const channels = computed(() => [
    {
      label: t("landing.pages.company.contacts.support_label"),
      email: cleanEmail(t("landing.pages.company.contacts.support_email")),
    },
    {
      label: t("landing.pages.company.contacts.finance_label"),
      email: cleanEmail(t("landing.pages.company.contacts.finance_email")),
    },
    {
      label: t("landing.pages.company.contacts.marketing_label"),
      email: cleanEmail(t("landing.pages.company.contacts.marketing_email")),
    },
  ]);
</script>

<style lang="scss" scoped>
  .contacts-page {
    padding: 0 40px 80px;
    background: #f6f6f6;
    color: var(--landing-text-primary);
    font-family: "DM Sans", sans-serif;
  }

  .contacts-eyebrow {
    margin: 0;
    color: #0051ff;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
  }

  .contacts-hero {
    display: grid;
    grid-template-areas:
      "visual copy"
      "visual links";
    grid-template-columns: minmax(0, 1fr) minmax(420px, 0.72fr);
    grid-template-rows: auto 1fr;
    column-gap: 24px;
    min-height: 520px;
    padding-top: 38px;

    &__visual {
      display: flex;
      grid-area: visual;
      align-items: center;
      min-width: 0;
      margin-block-start: -60px;
      margin-inline: -40px 0;

      img {
        display: block;
        width: 100%;
        max-width: 780px;
        height: auto;
      }
    }

    &__copy {
      grid-area: copy;
      align-self: end;
      padding-top: 20px;

      h1 {
        max-width: 555px;
        margin: 34px 0 0;
        color: #000;
        font-size: 82px;
        font-weight: 400;
        letter-spacing: -0.03em;
        line-height: 80px;
      }
    }

    &__intro {
      max-width: 440px;
      margin: 39px 0 0;
      color: #7b7b7b;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.32;
    }

    &__links {
      display: grid;
      grid-area: links;
      align-self: start;
      gap: 20px;
      margin: 20px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        gap: 16px;
        color: #000;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
      }

      img {
        flex: 0 0 24px;
      }
    }
  }

  .contacts-office-section {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
    margin-top: 10px;
  }

  .contacts-office {
    min-width: 0;
    padding: 0;

    h2 {
      margin: 18px 0 0;
      color: #000;
      font-size: 36px;
      font-weight: 500;
      line-height: 1;
    }

    &__address {
      max-width: 300px;
      margin: 20px 0 0;
      color: #7b7b7b;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.32;
    }

    strong {
      display: block;
      margin-top: 14px;
      color: #000;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.2;
    }
  }

  .contacts-channels {
    display: contents;
  }

  .contacts-channel {
    display: flex;
    min-width: 0;
    height: 180px;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(255, 255, 255, 0.92);
    border-radius: 16px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.95),
      0 16px 42px rgba(64, 85, 133, 0.035);
    color: inherit;
    text-decoration: none;

    &__label {
      color: #000;
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
    }

    &__email {
      color: #0051ff;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      overflow-wrap: anywhere;
      transition: color 0.2s ease;
    }

    &:hover .contacts-channel__email {
      color: #003dc2;
    }
  }

  .contacts-process {
    margin-top: 124px;

    &__intro {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;

      h2 {
        margin: 28px 0 0;
        color: #000;
        font-size: 42px;
        font-weight: 500;
        line-height: 1;
      }

      > p:last-child {
        margin: 22px 0 0;
        color: #7b7b7b;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.32;
      }
    }

    &__steps {
      display: grid;
      max-width: 900px;
      gap: 16px;
      margin: 58px auto 0;
      padding: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: 66px minmax(0, 1fr);
        gap: 18px;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.92);
        border-radius: 16px;
        padding: 18px 24px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.95),
          0 16px 42px rgba(64, 85, 133, 0.035);
      }

      img {
        width: 50px;
        height: 50px;
      }

      h3 {
        margin: 0;
        color: #000;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.15;
      }

      p {
        margin: 8px 0 0;
        color: #7b7b7b;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.32;
      }
    }
  }

  [dir="rtl"] {
    .contacts-hero__visual {
      margin-inline: 0 -40px;

      img {
        margin-inline: 0 auto;
      }
    }
  }

  @media (max-width: 1480px) {
    .contacts-page {
      padding-inline: 20px;
    }

    .contacts-hero__visual {
      margin-inline-start: -20px;
    }

    [dir="rtl"] .contacts-hero__visual {
      margin-inline-start: 0;
      margin-inline-end: -20px;
    }
  }

  @media (max-width: 1180px) {
    .contacts-hero {
      grid-template-columns: minmax(0, 1fr) minmax(370px, 0.72fr);
      min-height: 500px;

      &__copy h1 {
        font-size: 66px;
        line-height: 0.98;
      }
    }

    .contacts-office h2 {
      font-size: 30px;
    }

    .contacts-channel {
      padding: 20px;

      &__label {
        font-size: 20px;
      }

      &__email {
        font-size: 15px;
      }
    }
  }

  @media (max-width: 920px) {
    .contacts-hero {
      grid-template-columns: minmax(0, 1fr) minmax(330px, 0.78fr);

      &__visual {
        margin-inline-start: -20px;
      }

      &__copy h1 {
        font-size: 56px;
      }
    }

    .contacts-office-section {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .contacts-office {
      padding-bottom: 18px;
    }

    .contacts-channels {
      display: grid;
      grid-column: 2;
      gap: 16px;
    }

    .contacts-channel {
      height: 140px;
    }

    [dir="rtl"] .contacts-hero__visual {
      margin-inline-start: 0;
      margin-inline-end: -20px;
    }
  }

  @media (max-width: 767px) {
    .contacts-page {
      padding: 0 0 64px;
    }

    .contacts-eyebrow {
      font-size: 14px;
    }

    .contacts-hero {
      display: flex;
      min-height: 0;
      flex-direction: column;
      padding-top: 24px;

      &__copy {
        order: 1;
        padding-top: 0;

        h1 {
          margin-top: 24px;
          font-size: 42px;
          letter-spacing: -0.03em;
          line-height: 1;
        }
      }

      &__intro {
        margin-top: 22px;
        font-size: 14px;
        line-height: 1.3;
      }

      &__visual {
        order: 2;
        width: calc(100% + 16px);
        margin: 10px -8px 0;

        img {
          width: 100%;
          max-width: none;
        }
      }

      &__links {
        order: 3;
        gap: 18px;
        margin-top: 4px;

        li {
          gap: 12px;
          font-size: 14px;
        }
      }
    }

    .contacts-office-section {
      display: block;
      margin-top: 72px;
    }

    .contacts-office {
      padding: 0;

      h2 {
        margin-top: 18px;
        font-size: 30px;
      }

      &__address {
        margin-top: 18px;
        font-size: 14px;
      }

      strong {
        margin-top: 10px;
        font-size: 14px;
      }
    }

    .contacts-channels {
      display: grid;
      gap: 12px;
      margin-top: 20px;
    }

    .contacts-channel {
      height: 104px;
      padding: 18px;

      &__label {
        font-size: 16px;
      }

      &__email {
        font-size: 14px;
      }
    }

    .contacts-process {
      margin-top: 84px;

      &__intro {
        text-align: start;

        h2 {
          margin-top: 22px;
          font-size: 34px;
          line-height: 1.05;
        }

        > p:last-child {
          margin-top: 18px;
          font-size: 14px;
        }
      }

      &__steps {
        gap: 12px;
        margin-top: 34px;

        li {
          grid-template-columns: 50px minmax(0, 1fr);
          gap: 16px;
          align-items: start;
          padding: 18px;
        }

        h3 {
          font-size: 16px;
        }

        p {
          font-size: 14px;
        }
      }
    }

    [dir="rtl"] .contacts-hero__visual {
      margin: 10px -8px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contacts-channel__email {
      transition: none;
    }
  }
</style>
