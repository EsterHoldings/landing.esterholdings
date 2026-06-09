<template>
  <UiContainer>
    <section class="landing-static-page">
      <header class="landing-static-page__hero">
        <p class="landing-static-page__eyebrow">{{ content.eyebrow }}</p>
        <h1 class="landing-static-page__title">{{ title }}</h1>
        <p class="landing-static-page__lead">{{ content.lead }}</p>
      </header>

      <ul class="landing-static-page__highlights">
        <li
          v-for="highlight in content.highlights"
          :key="highlight">
          {{ highlight }}
        </li>
      </ul>

      <div class="landing-static-page__sections">
        <section
          v-for="section in content.sections"
          :key="section.title"
          class="landing-static-page__section">
          <span class="landing-static-page__section-line"></span>
          <h2>{{ section.title }}</h2>
          <p v-if="section.text">{{ section.text }}</p>
          <ul v-if="section.items?.length">
            <li
              v-for="item in section.items"
              :key="item">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
  import UiContainer from "~/components/ui/UiContainer.vue";
  import type { StaticPageContent } from "~/components/block/pages/staticPageContent";

  defineProps<{
    title: string;
    content: StaticPageContent;
  }>();
</script>

<style scoped lang="scss">
  .landing-static-page {
    display: flex;
    flex-direction: column;
    gap: 56px;
    color: var(--landing-text-primary);
  }

  .landing-static-page__hero {
    max-width: 920px;
  }

  .landing-static-page__eyebrow {
    margin: 0 0 16px;
    color: var(--landing-accent);
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .landing-static-page__title {
    margin: 0;
    max-width: 920px;
    color: var(--landing-text-primary);
    font-size: clamp(42px, 5.2vw, 84px);
    font-weight: 500;
    line-height: 0.96;
  }

  .landing-static-page__lead {
    max-width: 760px;
    margin: 24px 0 0;
    color: var(--landing-text-secondary);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.55;
  }

  .landing-static-page__highlights {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      color: var(--landing-text-primary);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.35;

      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 3px;
        margin-bottom: 16px;
        border-radius: 999px;
        background: var(--landing-accent);
      }
    }
  }

  .landing-static-page__sections {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 36px;
  }

  .landing-static-page__section {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;

    h2 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 24px;
      font-weight: 800;
      line-height: 1.16;
    }

    p,
    li {
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.56;
    }

    p {
      margin: 0;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      position: relative;
      padding-left: 20px;

      &::before {
        content: "";
        position: absolute;
        top: 0.72em;
        left: 0;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--landing-accent);
      }
    }
  }

  .landing-static-page__section-line {
    width: 100%;
    height: 1px;
    background: var(--landing-line);
  }

  @media (max-width: 900px) {
    .landing-static-page {
      gap: 40px;
    }

    .landing-static-page__highlights,
    .landing-static-page__sections {
      grid-template-columns: 1fr;
    }

    .landing-static-page__title {
      font-size: clamp(38px, 12vw, 58px);
    }
  }
</style>
