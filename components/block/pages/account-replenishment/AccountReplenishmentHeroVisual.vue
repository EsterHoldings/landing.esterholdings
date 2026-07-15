<template>
  <figure
    class="hero-visual"
    role="img"
    :aria-label="label">
    <img
      class="hero-visual__ambient"
      :src="`${ASSET_BASE}ambient.webp`"
      alt=""
      width="842"
      height="559"
      loading="eager"
      decoding="async"
      draggable="false"
      aria-hidden="true" />

    <svg
      class="hero-visual__connection"
      viewBox="0 0 842 559"
      fill="none"
      aria-hidden="true">
      <path
        class="hero-visual__connection-orbit"
        d="M137 150C185 205 264 125 350 173" />
      <path
        class="hero-visual__connection-orbit"
        d="M139 213C203 268 277 198 350 241" />
      <path
        class="hero-visual__connection-orbit"
        d="M148 275C215 315 286 272 351 292" />
      <path
        class="hero-visual__connection-sweep"
        d="M92 347C232 278 438 327 769 457" />
    </svg>

    <span
      v-for="layer in layers"
      :key="layer.name"
      class="hero-visual__layer"
      :class="`hero-visual__layer--${layer.name}`"
      aria-hidden="true">
      <img
        :src="`${ASSET_BASE}${layer.file}`"
        alt=""
        :width="layer.width"
        :height="layer.height"
        loading="eager"
        decoding="async"
        draggable="false" />
    </span>
  </figure>
</template>

<script setup lang="ts">
  defineProps<{
    label: string;
  }>();

  type VisualLayer = {
    name: string;
    file: string;
    width: number;
    height: number;
  };

  const ASSET_BASE = "/static/account-replenishment/hero/";

  const layers: VisualLayer[] = [
    { name: "deposit", file: "deposit-panel.webp", width: 295, height: 365 },
    { name: "status", file: "status-panel.webp", width: 205, height: 250 },
    { name: "fee", file: "fee-card.webp", width: 145, height: 180 },
    { name: "methods", file: "methods-card.webp", width: 180, height: 190 },
    { name: "tether", file: "tether.webp", width: 105, height: 105 },
    { name: "bitcoin", file: "bitcoin.webp", width: 90, height: 90 },
    { name: "ethereum", file: "ethereum.webp", width: 88, height: 90 },
    { name: "wallet", file: "wallet.webp", width: 240, height: 240 },
    { name: "bank", file: "bank-coin.webp", width: 112, height: 115 },
  ];
</script>

<style scoped lang="scss">
  .hero-visual {
    position: relative;
    isolation: isolate;
    width: min(100%, 842px);
    aspect-ratio: 842 / 559;
    margin: 0;
    overflow: visible;
    user-select: none;

    &__ambient,
    &__connection,
    &__layer {
      position: absolute;
      pointer-events: none;
    }

    &__ambient,
    &__connection {
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
    }

    &__ambient {
      z-index: 0;
      object-fit: contain;
    }

    &__connection {
      z-index: 1;
      overflow: visible;
      stroke: rgba(72, 132, 255, 0.22);
      stroke-linecap: round;
      stroke-width: 1;
    }

    &__connection-orbit {
      stroke-dasharray: 3 5;
      opacity: 0.56;
    }

    &__connection-sweep {
      stroke-width: 1.1;
      opacity: 0.34;
    }

    &__layer {
      z-index: 2;

      img {
        display: block;
        width: 100%;
        height: auto;
        object-fit: contain;
      }
    }

    &__layer--deposit {
      left: 38.005%;
      top: 1.789%;
      width: 35.036%;
    }

    &__layer--status {
      left: 70.071%;
      top: 6.798%;
      width: 24.347%;
    }

    &__layer--fee {
      left: 21.971%;
      top: 54.562%;
      width: 17.221%;
    }

    &__layer--methods {
      left: 35.629%;
      top: 58.14%;
      width: 21.378%;
    }

    &__layer--tether {
      left: 20.784%;
      top: 12.522%;
      width: 12.47%;
      --coin-mask: url("/static/account-replenishment/hero/tether.webp");
      --float-duration: 9.8s;
      --float-delay: -2.2s;
      --float-y: -2px;
      --float-rotate: 0.12deg;
      --glint-duration: 14.5s;
      --glint-delay: -4s;
    }

    &__layer--bitcoin {
      left: 27.316%;
      top: 31.664%;
      width: 10.689%;
      --coin-mask: url("/static/account-replenishment/hero/bitcoin.webp");
      --float-duration: 10.6s;
      --float-delay: -6.1s;
      --float-y: -1.8px;
      --float-rotate: -0.1deg;
      --glint-duration: 16s;
      --glint-delay: -9s;
    }

    &__layer--ethereum {
      left: 16.152%;
      top: 40.966%;
      width: 10.451%;
      --coin-mask: url("/static/account-replenishment/hero/ethereum.webp");
      --float-duration: 11.4s;
      --float-delay: -4.7s;
      --float-y: -1.7px;
      --float-rotate: 0.1deg;
      --glint-duration: 15.2s;
      --glint-delay: -1.5s;
    }

    &__layer--wallet {
      z-index: 4;
      left: 58.789%;
      top: 47.406%;
      width: 28.504%;
    }

    &__layer--bank {
      z-index: 5;
      left: 56.77%;
      top: 77.281%;
      width: 13.302%;
      --coin-mask: url("/static/account-replenishment/hero/bank-coin.webp");
      --glint-duration: 17s;
      --glint-delay: -7.5s;
    }

    &__layer--tether,
    &__layer--bitcoin,
    &__layer--ethereum {
      z-index: 3;
      animation: hero-coin-float var(--float-duration) ease-in-out var(--float-delay) infinite;
      will-change: transform;
    }

    &__layer--tether,
    &__layer--bitcoin,
    &__layer--ethereum,
    &__layer--bank {
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(112deg, transparent 35%, rgba(255, 255, 255, 0.62) 49%, transparent 63%);
        opacity: 0;
        transform: translateX(-48%);
        mask: var(--coin-mask) center / contain no-repeat;
        -webkit-mask: var(--coin-mask) center / contain no-repeat;
        mix-blend-mode: screen;
        animation: hero-coin-glint var(--glint-duration) ease-in-out var(--glint-delay) infinite;
      }
    }
  }

  @keyframes hero-coin-float {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(0);
    }

    50% {
      transform: translate3d(0, var(--float-y), 0) rotate(var(--float-rotate));
    }
  }

  @keyframes hero-coin-glint {
    0%,
    68% {
      opacity: 0;
      transform: translateX(-48%);
    }

    76% {
      opacity: 0.12;
    }

    86% {
      opacity: 0;
      transform: translateX(48%);
    }

    100% {
      opacity: 0;
      transform: translateX(48%);
    }
  }

  @media (max-width: 575px) {
    .hero-visual {
      &__layer--tether,
      &__layer--bitcoin,
      &__layer--ethereum {
        --float-y: -1px;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-visual {
      &__layer--tether,
      &__layer--bitcoin,
      &__layer--ethereum,
      &__layer--bank {
        animation: none;

        &::after {
          animation: none;
        }
      }
    }
  }
</style>
