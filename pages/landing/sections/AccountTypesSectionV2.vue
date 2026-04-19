<template>
  <section class="accounts-v2">
    <UiContainer>
      <h2 class="accounts-v2__title">{{ t("landing.sections.accounts__title") }}</h2>
      <div class="accounts-v2__cards">
        <article
          v-for="card in cards"
          :key="card.id"
          class="accounts-v2__card"
          :class="`accounts-v2__card--${card.theme}`">
          <span
            v-if="card.badge"
            class="accounts-v2__badge"
            >{{ card.badge }}</span
          >
          <div class="accounts-v2__card-header">
            <p class="accounts-v2__card-name">{{ card.title }}</p>
            <p class="accounts-v2__card-desc">{{ card.subtitle }}</p>
          </div>
          <div class="accounts-v2__features">
            <div
              v-for="feat in card.features"
              :key="feat.text"
              class="accounts-v2__feature">
              <component :is="feat.icon" />
              <span>{{ feat.text }}</span>
            </div>
          </div>
          <a
            :href="cabinetLink('/auth/registration')"
            class="accounts-v2__link">
            <button class="accounts-v2__btn">{{ card.buttonText }}</button>
          </a>
        </article>
      </div>
    </UiContainer>
    <div class="accounts-v2__blob accounts-v2__blob--left" />
    <div class="accounts-v2__blob accounts-v2__blob--right" />
  </section>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import UiIconReverage from "~/components/ui/UiIconReverage.vue";
  import UiIconSpreads from "~/components/ui/UiIconSpreads.vue";
  import UiIconDeposit from "~/components/ui/UiIconDeposit.vue";
  import UiIconFirstDeposit from "~/components/ui/UiIconFirstDeposit.vue";
  import UiIconShareDeposit from "~/components/ui/UiIconShareDeposit.vue";
  import UiIconRealTime from "~/components/ui/UiIconRealTime.vue";
  import { useCabinetLink } from "~/composables/useCabinetLink";

  const { t } = useI18n();
  const { cabinetLink } = useCabinetLink();

  // Индексы соответствуют порядку в accounts__options: demo=0, standard=1, tandem=3
  const cards = computed(() => [
    {
      id: "demo",
      theme: "orange",
      badge: t("landing.sections.accounts__badge_recommended"),
      title: t("landing.sections.accounts__options[0].title"),
      subtitle: t("landing.sections.accounts__options[0].description"),
      features: [
        { icon: UiIconReverage, text: t("landing.sections.accounts__options[0].features[0]") },
        { icon: UiIconSpreads, text: t("landing.sections.accounts__options[0].features[1]") },
        { icon: UiIconDeposit, text: t("landing.sections.accounts__options[0].features[2]") },
      ],
      buttonText: t("landing.sections.accounts__options[0].buttonText"),
    },
    {
      id: "standard",
      theme: "blue",
      badge: null,
      title: t("landing.sections.accounts__options[1].title"),
      subtitle: t("landing.sections.accounts__options[1].description"),
      features: [
        { icon: UiIconReverage, text: t("landing.sections.accounts__options[1].features[0]") },
        { icon: UiIconSpreads, text: t("landing.sections.accounts__options[1].features[1]") },
        { icon: UiIconFirstDeposit, text: t("landing.sections.accounts__options[1].features[2]") },
      ],
      buttonText: t("landing.sections.accounts__options[1].buttonText"),
    },
    {
      id: "tandem",
      theme: "blue",
      badge: null,
      title: t("landing.sections.accounts__options[3].title"),
      subtitle: t("landing.sections.accounts__options[3].description"),
      features: [
        { icon: UiIconReverage, text: t("landing.sections.accounts__options[3].features[0]") },
        { icon: UiIconShareDeposit, text: t("landing.sections.accounts__options[3].features[1]") },
        { icon: UiIconRealTime, text: t("landing.sections.accounts__options[3].features[2]") },
      ],
      buttonText: t("landing.sections.accounts__options[3].buttonText"),
    },
  ]);
</script>

<style lang="scss" scoped>
  .accounts-v2 {
    position: relative;
    margin-top: 160px;
    overflow: hidden;

    &__title {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 42px;
      font-weight: 500;
      line-height: 1.302;
    }

    &__cards {
      margin-top: 34px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    &__card {
      position: relative;
      border: 6px solid var(--landing-border-strong);
      border-radius: 20px;
      padding: 30px;
      background: linear-gradient(-22deg, var(--landing-surface) 16.6%, var(--landing-surface-muted) 84.4%);
      display: flex;
      flex-direction: column;
      gap: 30px;

      &--orange {
        border-top-right-radius: 0;

        .accounts-v2__card-desc {
          color: var(--landing-accent-secondary);
        }

        .accounts-v2__btn {
          background: var(--landing-accent-secondary);
        }
      }

      &--blue {
        .accounts-v2__card-desc {
          color: var(--landing-accent);
        }

        .accounts-v2__btn {
          background: var(--landing-accent);
        }
      }
    }

    &__badge {
      position: absolute;
      top: -18px;
      right: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      padding: 0 10px;
      background: var(--landing-accent-secondary);
      border: 6px solid var(--landing-border-strong);
      border-radius: 100px;
      color: var(--landing-on-accent);
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      line-height: 1;
    }

    &__card-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__card-name {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: var(--landing-text-primary);
      line-height: 1.302;
    }

    &__card-desc {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.302;
    }

    &__features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: 1;
    }

    &__feature {
      display: flex;
      align-items: center;
      gap: 10px;

      :deep(svg) {
        flex-shrink: 0;
      }

      :deep(svg [fill="black"]) {
        fill: var(--landing-text-primary);
      }

      :deep(svg [stroke="black"]) {
        stroke: var(--landing-text-primary);
      }

      span {
        font-size: 16px;
        font-weight: 700;
        color: var(--landing-text-secondary);
        line-height: 1.302;
      }
    }

    &__link {
      display: block;
    }

    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 42px;
      padding: 10px 16px;
      border: none;
      border-radius: 12px;
      color: var(--landing-on-accent);
      font-size: 16px;
      font-weight: 700;
      line-height: 1.3;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: inherit;
      text-align: center;
      word-break: break-word;

      &:hover {
        opacity: 0.88;
      }
    }

    &__blob {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;

      &--left {
        bottom: 0;
        left: -60px;
        width: 200px;
        height: 200px;
        background: var(--landing-blob-left);
        filter: blur(40px);
      }

      &--right {
        bottom: 0;
        right: 160px;
        width: 140px;
        height: 140px;
        background: var(--landing-blob-right);
        filter: blur(30px);
      }
    }
  }

  @media (max-width: 991px) {
    .accounts-v2 {
      margin-top: 56px;

      &__title {
        font-size: 34px;
      }

      &__cards {
        grid-template-columns: 1fr;
      }

      &__card--orange {
        border-top-right-radius: 20px;
      }

      &__badge {
        top: -18px;
        right: -6px;
      }
    }
  }
</style>
