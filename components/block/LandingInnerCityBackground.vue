<template>
  <div
    class="inner-city-bg"
    aria-hidden="true" />
</template>

<style scoped lang="scss">
  .inner-city-bg {
    position: fixed;
    top: calc(92px + env(safe-area-inset-top, 0px));
    right: 0;
    bottom: 0;
    z-index: 0;
    width: min(42vw, 620px);
    min-width: 280px;
    opacity: 0.1;
    pointer-events: none;
    background-image: url("/static/cabinet-city-light.svg");
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: contain;
    contain: paint;
    transition: opacity 0.2s ease;
  }

  :global(:root[data-theme="dark"]) .inner-city-bg {
    opacity: 0.07;
    background-image: url("/static/cabinet-city-dark.svg");
  }

  @media (max-width: 991px) {
    .inner-city-bg {
      top: calc(78px + env(safe-area-inset-top, 0px));
      right: -64px;
      width: min(68vw, 460px);
      min-width: 300px;
      opacity: 0.08;
    }

    :global(:root[data-theme="dark"]) .inner-city-bg {
      opacity: 0.06;
    }
  }

  @media (max-width: 575px) {
    .inner-city-bg {
      right: -120px;
      width: 360px;
      min-width: 360px;
      opacity: 0.07;
    }

    :global(:root[data-theme="dark"]) .inner-city-bg {
      opacity: 0.05;
    }
  }
</style>
