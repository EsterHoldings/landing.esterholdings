<template>
  <p
    class="running-quote-price"
    :aria-label="value">
    <span
      v-for="char in chars"
      :key="char.id"
      :class="charClasses(char)"
      aria-hidden="true">
      <template v-if="char.changed && char.digit">
        <span class="running-quote-price__stack">
          <span class="running-quote-price__value running-quote-price__value--old">
            {{ char.previous }}
          </span>
          <span class="running-quote-price__value running-quote-price__value--new">
            {{ char.current }}
          </span>
        </span>
      </template>
      <template v-else>
        {{ char.current }}
      </template>
    </span>
  </p>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";

  type QuoteDirection = "up" | "down" | null;

  type PriceChar = {
    id: string;
    current: string;
    previous: string;
    changed: boolean;
    digit: boolean;
    space: boolean;
    direction: QuoteDirection;
  };

  const props = withDefaults(
    defineProps<{
      value: string;
      direction?: QuoteDirection;
    }>(),
    {
      direction: null,
    }
  );

  const animationVersion = ref(0);
  const isDigit = (value: string): boolean => /^[0-9]$/.test(value);
  const chars = ref<PriceChar[]>(buildChars("", props.value, null, animationVersion.value));

  function buildChars(from: string, to: string, direction: QuoteDirection, version: number): PriceChar[] {
    const previousChars = from.split("");
    const currentChars = to.split("");
    const length = Math.max(previousChars.length, currentChars.length);

    return Array.from({ length }, (_, index) => {
      const previous = previousChars[index] ?? "";
      const current = currentChars[index] ?? "";
      const digit = isDigit(current) || isDigit(previous);
      const changed = previous !== current && current !== "";

      return {
        id: `${version}-${index}-${previous}-${current}`,
        current,
        previous,
        changed,
        digit,
        space: current === " ",
        direction,
      };
    });
  }

  const charClasses = (char: PriceChar) => ({
    "running-quote-price__char": true,
    "running-quote-price__char--digit": char.digit,
    "running-quote-price__char--space": char.space,
    "running-quote-price__char--changed": char.changed && char.digit,
    "running-quote-price__char--changed-up": char.changed && char.digit && char.direction === "up",
    "running-quote-price__char--changed-down": char.changed && char.digit && char.direction === "down",
  });

  watch(
    () => props.value,
    (value, previousValue) => {
      animationVersion.value += 1;
      chars.value = buildChars(previousValue, value, props.direction, animationVersion.value);
    }
  );
</script>

<style scoped lang="scss">
  .running-quote-price {
    display: inline-flex;
    align-items: baseline;
    min-height: 1.302em;
    margin: 0;
    color: var(--landing-text-primary);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
    letter-spacing: 0;

    &__char {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0.22em;
      height: 1.18em;
      overflow: hidden;
      line-height: 1;
      color: inherit;
    }

    &__char--digit {
      width: 0.62em;
    }

    &__char--space {
      width: 0.36em;
    }

    &__stack {
      position: relative;
      display: block;
      width: 100%;
      height: 1.18em;
    }

    &__value {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      will-change: transform, opacity;
    }

    &__char--changed-up {
      animation: quote-price-glow-up 1.55s ease-out both;
    }

    &__char--changed-down {
      animation: quote-price-glow-down 1.55s ease-out both;
    }

    &__char--changed-up &__value--old {
      animation: quote-price-old-up 0.52s cubic-bezier(0.22, 0.88, 0.32, 1) both;
    }

    &__char--changed-up &__value--new {
      animation: quote-price-new-up 0.52s cubic-bezier(0.22, 0.88, 0.32, 1) both;
    }

    &__char--changed-down &__value--old {
      animation: quote-price-old-down 0.52s cubic-bezier(0.22, 0.88, 0.32, 1) both;
    }

    &__char--changed-down &__value--new {
      animation: quote-price-new-down 0.52s cubic-bezier(0.22, 0.88, 0.32, 1) both;
    }
  }

  @keyframes quote-price-old-up {
    0% {
      opacity: 1;
      transform: translateY(0);
    }

    100% {
      opacity: 0;
      transform: translateY(-105%);
    }
  }

  @keyframes quote-price-new-up {
    0% {
      opacity: 0;
      transform: translateY(105%);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes quote-price-old-down {
    0% {
      opacity: 1;
      transform: translateY(0);
    }

    100% {
      opacity: 0;
      transform: translateY(105%);
    }
  }

  @keyframes quote-price-new-down {
    0% {
      opacity: 0;
      transform: translateY(-105%);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes quote-price-glow-up {
    0%,
    100% {
      color: var(--landing-text-primary);
      text-shadow: none;
    }

    18%,
    58% {
      color: #36b968;
      text-shadow: 0 0 12px rgba(54, 185, 104, 0.42);
    }
  }

  @keyframes quote-price-glow-down {
    0%,
    100% {
      color: var(--landing-text-primary);
      text-shadow: none;
    }

    18%,
    58% {
      color: #ff7474;
      text-shadow: 0 0 12px rgba(255, 116, 116, 0.4);
    }
  }
</style>
