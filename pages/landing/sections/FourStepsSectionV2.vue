<template>
  <section
    ref="sectionRef"
    class="steps-v2"
    @pointermove="handlePointerMove"
    @pointerleave="resetPointer">
    <UiContainer>
      <h2>
        {{ t("landing.sections.four_steps_section.title.before") }}
        <span>{{ t("landing.sections.four_steps_section.title.highlight") }}</span>
      </h2>
      <div class="steps-grid">
        <article
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="`step--${index + 1}`">
          <div class="step__icon">
            <span class="step__orb step__orb--solid" />
            <span class="step__orb step__orb--glow" />
            <span class="step__number">{{ index + 1 }}</span>
          </div>
          <div class="step__body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </article>
      </div>
      <UiButtonV2
        :to="cabinetLink('/auth/registration')"
        class="steps-v2__cta">
        {{ t("landing.sections.four_steps_section.button") }}
      </UiButtonV2>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import UiButtonV2 from "~/components/ui/UiButtonV2.vue";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import { useCabinetLink } from "~/composables/useCabinetLink";

  const { t, tm } = useI18n();
  const { cabinetLink } = useCabinetLink();
  const sectionRef = ref<HTMLElement | null>(null);

  const steps = computed(() => {
    const items = tm("landing.sections.four_steps_section.items") as any[];
    if (!Array.isArray(items)) return [];
    return items.map((_, index) => ({
      title: t(`landing.sections.four_steps_section.items[${index}].title`),
      text: t(`landing.sections.four_steps_section.items[${index}].text`),
    }));
  });

  const updatePointerOffset = (x = 0, y = 0) => {
    sectionRef.value?.style.setProperty("--step-orb-x", `${x}px`);
    sectionRef.value?.style.setProperty("--step-orb-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const element = sectionRef.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    updatePointerOffset(x, y);
  };

  const resetPointer = () => {
    updatePointerOffset();
  };
</script>

<style lang="scss" scoped>
  .steps-v2 {
    margin-top: 160px;
    --step-orb-x: 0px;
    --step-orb-y: 0px;

    h2 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 42px;
      line-height: 1.302;
      font-weight: 500;

      span {
        color: var(--landing-accent);
      }
    }
  }

  .steps-grid {
    margin-top: 34px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .step {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__icon {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 20px;
      border: 1px solid color-mix(in srgb, var(--landing-text-accent-soft) 58%, transparent);
      background:
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--landing-surface-elevated) 94%, var(--landing-accent) 6%),
          color-mix(in srgb, var(--landing-surface-elevated) 88%, var(--landing-bg) 12%)
        );
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 22%, transparent),
        inset 0 -18px 28px color-mix(in srgb, var(--landing-accent) 7%, transparent);
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      padding: 10px 0 10px 14px;
      flex-shrink: 0;
      overflow: visible;
      isolation: isolate;

      &::after {
        content: "";
        position: absolute;
        pointer-events: none;
      }

      &::after {
        inset: 0;
        z-index: 2;
        border-radius: inherit;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02)),
          linear-gradient(145deg, transparent, color-mix(in srgb, var(--landing-accent) 8%, transparent));
        box-shadow:
          inset 0 1px 0 color-mix(in srgb, var(--landing-on-accent) 22%, transparent),
          inset 0 -18px 28px color-mix(in srgb, var(--landing-accent) 7%, transparent);
      }

      .step__orb {
        position: absolute;
        pointer-events: none;
        border-radius: 999px;
        transform: translate(var(--step-orb-x), var(--step-orb-y));
        transition: transform 180ms ease-out;
        will-change: transform;
      }

      .step__orb--solid {
        width: 36px;
        height: 36px;
        background: linear-gradient(145deg, #1b63ff 0%, #4d86ff 100%);
        z-index: 0;
      }

      .step__orb--glow {
        width: 25px;
        height: 25px;
        background: radial-gradient(circle, rgba(142, 181, 255, 0.95) 0%, rgba(60, 122, 255, 0.62) 44%, transparent 72%);
        filter: blur(3px);
        z-index: 1;
      }

      .step__number {
        position: relative;
        z-index: 3;
        color: var(--landing-accent);
        font-size: 42px;
        font-weight: 500;
        line-height: 1;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    h3 {
      margin: 0;
      color: var(--landing-accent);
      font-size: 28px;
      font-weight: 500;
      line-height: normal;
    }

    p {
      margin: 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      font-weight: 400;
      line-height: normal;
    }
  }

  .step--1,
  .step--3 {
    .step__icon {
      .step__orb--solid {
        top: -8px;
        right: -11px;
      }

      .step__orb--glow {
        top: 8px;
        right: 6px;
      }
    }
  }

  .step--2 {
    .step__icon {
      .step__orb--solid {
        right: -10px;
        bottom: -8px;
      }

      .step__orb--glow {
        right: 2px;
        bottom: 5px;
      }
    }
  }

  .step--4 {
    .step__icon {
      .step__orb--solid {
        left: -13px;
        bottom: -9px;
      }

      .step__orb--glow {
        left: 2px;
        bottom: 5px;
      }
    }
  }

  :global(:root[data-theme="dark"] .step__icon) {
    border-color: rgba(139, 164, 214, 0.58);
    background:
      linear-gradient(145deg, rgba(21, 38, 76, 0.95) 0%, rgba(10, 24, 55, 0.98) 100%),
      #0b1b44;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 -18px 28px rgba(0, 81, 255, 0.08);
  }

  .steps-v2__cta {
    margin-top: 34px;
  }

  @media (max-width: 991px) {
    .steps-v2 {
      margin-top: 56px;

      h2 {
        font-size: 34px;
      }
    }

    .steps-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 575px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }

    .steps-v2__cta {
      width: 100%;
    }
  }
</style>
