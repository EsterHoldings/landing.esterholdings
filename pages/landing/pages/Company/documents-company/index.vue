<template>
  <UiContainer>
    <main
      class="documents-page"
      :dir="isRtl ? 'rtl' : 'ltr'">
      <section class="documents-hero">
        <div class="documents-hero__copy">
          <p class="documents-eyebrow">
            {{ t("landing.pages.company.documents.eyebrow") }}
          </p>

          <h1>{{ t("landing.pages.company.documents.title") }}</h1>

          <p class="documents-hero__intro">
            {{ t("landing.pages.company.documents.intro") }}
          </p>
        </div>

        <div
          class="documents-hero__visual"
          aria-hidden="true">
          <img
            src="/static/documents/hero.png"
            alt=""
            width="864"
            height="691" />
        </div>

        <ul class="documents-hero__links">
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

      <section class="documents-details">
        <article class="documents-regulations">
          <h2>{{ t("landing.pages.company.documents.regulations_title") }}</h2>
          <p class="documents-details__lead">
            {{ t("landing.pages.company.documents.regulations_subtitle") }}
          </p>

          <ul class="documents-list documents-list--checks">
            <li
              v-for="item in regulationsList"
              :key="item">
              <span
                class="documents-list__check"
                aria-hidden="true" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>

        <article class="documents-contract">
          <h2>{{ t("landing.pages.company.documents.contract_title") }}</h2>
          <p class="documents-details__lead documents-contract__description">
            {{ t("landing.pages.company.documents.contract_description") }}
          </p>

          <ul class="documents-list documents-list--facts">
            <li
              v-for="item in contractFacts"
              :key="item">
              <img
                src="/static/documents/icon-contract.svg"
                alt=""
                width="24"
                height="24" />
              <span>{{ item }}</span>
            </li>
          </ul>

          <button
            class="documents-contract__button"
            type="button"
            @click="handleClickContract">
            {{ t("landing.pages.company.documents.button") }}
          </button>
        </article>
      </section>

      <section class="documents-process">
        <div class="documents-process__intro">
          <p class="documents-eyebrow">
            {{ t("landing.pages.company.documents.process_eyebrow") }}
          </p>
          <h2>{{ t("landing.pages.company.documents.process_title") }}</h2>
          <p>{{ t("landing.pages.company.documents.process_text") }}</p>
        </div>

        <ol class="documents-process__steps">
          <li
            v-for="(step, index) in processSteps"
            :key="step.title">
            <span
              class="documents-process__number"
              aria-hidden="true">
              {{ index + 1 }}
            </span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
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
    alias: "/documents",
  });

  type ProcessStep = {
    title: string;
    text: string;
  };

  const { t, tm, locale } = useI18n();

  const heroLinkIcons = [
    "/static/documents/icon-client-agreement.svg",
    "/static/documents/icon-trading-rules.svg",
    "/static/documents/icon-operational-procedures.svg",
  ];

  const isRtl = computed(() => locale.value.split("-")[0] === "he");

  const getTranslatedList = (key: string) => {
    const list = tm(key) as unknown[];
    return Array.isArray(list) ? list.map((_, index) => t(`${key}[${index}]`)) : [];
  };

  const heroLinks = computed(() => getTranslatedList("landing.pages.company.documents.hero_links"));
  const regulationsList = computed(() => getTranslatedList("landing.pages.company.documents.regulations_list"));
  const contractFacts = computed(() => getTranslatedList("landing.pages.company.documents.contract_facts"));

  const processSteps = computed<ProcessStep[]>(() => {
    const key = "landing.pages.company.documents.process_steps";
    const steps = tm(key) as unknown[];

    if (!Array.isArray(steps)) return [];

    return steps.map((_, index) => ({
      title: t(`${key}[${index}].title`),
      text: t(`${key}[${index}].text`),
    }));
  });

  const handleClickContract = () => {
    const url = "https://esterholdings.com/wp-content/uploads/ESTER-HOLDINGS-INC_PUBLIC_OFFER_2024_EN.pdf";
    window.open(url, "_blank", "noopener,noreferrer");
  };
</script>

<style lang="scss" scoped>
  .documents-page {
    padding: 0 40px 76px;
    color: var(--landing-text-primary);
    font-family: "DM Sans", sans-serif;
  }

  .documents-eyebrow {
    margin: 0;
    color: var(--landing-accent);
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
  }

  .documents-hero {
    display: grid;
    grid-template-areas:
      "copy visual"
      "links visual";
    grid-template-columns: minmax(430px, 0.77fr) minmax(0, 1.23fr);
    grid-template-rows: auto 1fr;
    min-height: 655px;
    padding-top: 56px;

    &__copy {
      grid-area: copy;
      align-self: end;
      padding-bottom: 22px;

      h1 {
        max-width: 555px;
        margin: 34px 0 0;
        color: var(--landing-text-strong);
        font-size: 82px;
        font-weight: 400;
        letter-spacing: -0.03em;
        line-height: 80px;
      }
    }

    &__intro {
      max-width: 440px;
      margin: 39px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 400;
      line-height: 1.32;
    }

    &__visual {
      grid-area: visual;
      align-self: center;
      min-width: 0;
      margin-inline: -22px -30px;

      img {
        display: block;
        width: 100%;
        max-width: 770px;
        height: auto;
        margin-inline: auto 0;
      }
    }

    &__links {
      display: grid;
      grid-area: links;
      align-self: start;
      gap: 20px;
      margin: 8px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        gap: 16px;
        align-items: center;
        color: var(--landing-text-strong);
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
      }

      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .documents-details {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(72px, 9vw, 132px);
    margin-top: 54px;

    h2 {
      margin: 0;
      color: var(--landing-text-strong);
      font-size: 42px;
      font-weight: 500;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    &__lead {
      margin: 32px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.32;
    }
  }

  .documents-list {
    display: grid;
    gap: 22px;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      gap: 16px;
      align-items: start;
      color: var(--landing-text-strong);
      font-size: 16px;
      font-weight: 700;
      line-height: 1.25;
    }

    &__check {
      position: relative;
      width: 22px;
      height: 22px;
      border: 2px solid var(--landing-accent);
      border-radius: 50%;

      &::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 6px;
        width: 5px;
        height: 8px;
        border-right: 2px solid var(--landing-accent);
        border-bottom: 2px solid var(--landing-accent);
        transform: rotate(45deg);
      }
    }

    &--facts {
      gap: 20px;
      margin-top: 32px;

      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .documents-contract {
    &__description {
      max-width: 570px;
      font-weight: 700;
    }

    &__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 320px;
      min-height: 70px;
      margin-top: 44px;
      border: 0;
      border-radius: 16px;
      background: var(--landing-accent);
      color: #fff;
      cursor: pointer;
      font: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      transition:
        background-color 180ms ease,
        transform 180ms ease;

      &:hover {
        background: color-mix(in srgb, var(--landing-accent) 88%, #000);
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: 3px solid color-mix(in srgb, var(--landing-accent) 28%, transparent);
        outline-offset: 3px;
      }
    }
  }

  .documents-process {
    margin-top: 140px;

    &__intro {
      h2 {
        max-width: 920px;
        margin: 25px 0 0;
        color: var(--landing-text-strong);
        font-size: 42px;
        font-weight: 500;
        letter-spacing: -0.02em;
        line-height: 1.08;
      }

      > p:last-child {
        max-width: 980px;
        margin: 20px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 400;
        line-height: 1.35;
      }
    }

    &__steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(44px, 7vw, 104px);
      margin: 66px 0 0;
      padding: 0;
      list-style: none;

      li {
        min-width: 0;
      }

      h3 {
        margin: 26px 0 0;
        color: var(--landing-text-strong);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.15;
      }

      p {
        margin: 13px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 400;
        line-height: 1.3;
      }
    }

    &__number {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border: 1px solid rgba(255, 255, 255, 0.92);
      border-radius: 16px;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.24));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.98),
        0 10px 28px rgba(43, 78, 154, 0.06);
      color: var(--landing-accent);
      font-size: 32px;
      font-weight: 400;
      line-height: 1;

      &::before,
      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        border-radius: 50%;
        background: linear-gradient(145deg, #0051ff 10%, #4c86ff 72%);
      }

      &::before {
        top: -10px;
        right: -8px;
        width: 30px;
        height: 30px;
        box-shadow: 0 6px 10px rgba(0, 81, 255, 0.2);
      }

      &::after {
        right: -15px;
        bottom: -12px;
        width: 24px;
        height: 24px;
        opacity: 0.95;
      }
    }
  }

  [dir="rtl"] {
    .documents-hero__visual img {
      margin-inline: 0 auto;
    }
  }

  @media (max-width: 1480px) {
    .documents-page {
      padding-inline: 20px;
    }
  }

  @media (max-width: 1100px) {
    .documents-hero {
      grid-template-columns: minmax(370px, 0.82fr) minmax(0, 1.18fr);

      &__copy h1 {
        font-size: 66px;
        line-height: 0.98;
      }
    }
  }

  @media (max-width: 767px) {
    .documents-page {
      padding: 20px 0 48px;
    }

    .documents-eyebrow {
      font-size: 14px;
    }

    .documents-hero {
      display: grid;
      grid-template-areas:
        "copy"
        "visual"
        "links";
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto;
      min-height: 0;
      padding-top: 0;

      &__copy {
        align-self: auto;
        padding-bottom: 0;

        h1 {
          max-width: none;
          margin-top: 23px;
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
        margin: 20px -14px 0;

        img {
          width: 100%;
          max-width: none;
          margin: 0;
        }
      }

      &__links {
        gap: 14px;
        margin-top: 12px;

        li {
          gap: 12px;
          font-size: 14px;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }
    }

    .documents-details {
      grid-template-columns: minmax(0, 1fr);
      gap: 58px;
      margin-top: 72px;

      h2 {
        font-size: 34px;
        line-height: 1.05;
      }

      &__lead {
        margin-top: 24px;
        font-size: 14px;
      }
    }

    .documents-list {
      gap: 18px;
      margin-top: 24px;

      li {
        grid-template-columns: 20px minmax(0, 1fr);
        gap: 12px;
        font-size: 14px;
        line-height: 1.25;
      }

      &__check {
        width: 18px;
        height: 18px;
        border-width: 1.5px;

        &::after {
          top: 3px;
          left: 5px;
          width: 4px;
          height: 7px;
          border-width: 0 1.5px 1.5px 0;
        }
      }

      &--facts img {
        width: 20px;
        height: 20px;
      }
    }

    .documents-contract__button {
      width: 100%;
      min-height: 64px;
      margin-top: 32px;
      font-size: 17px;
    }

    .documents-process {
      margin-top: 96px;

      &__intro {
        h2 {
          margin-top: 18px;
          font-size: 34px;
        }

        > p:last-child {
          margin-top: 15px;
          font-size: 14px;
        }
      }

      &__steps {
        grid-template-columns: minmax(0, 1fr);
        gap: 46px;
        margin-top: 48px;

        h3 {
          margin-top: 22px;
          font-size: 17px;
        }

        p {
          margin-top: 10px;
          font-size: 14px;
        }
      }

      &__number {
        width: 66px;
        height: 66px;
        font-size: 28px;
      }
    }
  }
</style>
