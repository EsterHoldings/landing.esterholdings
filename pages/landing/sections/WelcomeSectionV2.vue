<template>
  <section class="welcome-v2">
    <div
      ref="heroRef"
      class="hero"
      :class="{ 'hero--dragging': isDragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel">
      <div
        class="hero__glows"
        aria-hidden="true">
        <span class="hero__glow hero__glow--blue-1"></span>
        <span class="hero__glow hero__glow--blue-2"></span>
        <span class="hero__glow hero__glow--orange-1"></span>
        <span class="hero__glow hero__glow--orange-2"></span>
      </div>

      <div class="hero__content">
        <div class="hero__content-stage">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="hero__content-slide"
            :class="{ 'is-active': index === currentSlide }"
            :style="getSlideStyle(index)"
            :aria-hidden="index !== currentSlide">
            <h1 class="hero__title">
              <span
                class="hero__shimmer hero__shimmer--title"
                :data-text="slide.line1Prefix">
                {{ slide.line1Prefix }}
              </span>
              <span
                class="hero__shimmer hero__shimmer--accent"
                :data-text="slide.line1Accent">
                {{ slide.line1Accent }}
              </span>
              <span
                class="hero__shimmer hero__shimmer--title"
                :data-text="slide.line1Suffix">
                {{ slide.line1Suffix }}
              </span>

              <template v-if="slide.line2Prefix || slide.line2Accent || slide.line2Suffix">
                <br />
                <span
                  class="hero__shimmer hero__shimmer--title"
                  :data-text="slide.line2Prefix">
                  {{ slide.line2Prefix }}
                </span>
                <span
                  class="hero__shimmer hero__shimmer--accent"
                  :data-text="slide.line2Accent">
                  {{ slide.line2Accent }}
                </span>
                <span
                  class="hero__shimmer hero__shimmer--title"
                  :data-text="slide.line2Suffix">
                  {{ slide.line2Suffix }}
                </span>
              </template>
            </h1>

            <p
              class="hero__subtitle hero__shimmer hero__shimmer--muted"
              :data-text="slide.subtitle">
              {{ slide.subtitle }}
            </p>

            <ul
              v-if="slide.benefits.length"
              class="hero__benefits">
              <li
                v-for="item in slide.benefits"
                :key="item.text">
                <img
                  :src="item.icon"
                  :alt="item.text"
                  loading="lazy" />
                <span
                  class="hero__shimmer hero__shimmer--benefit"
                  :data-text="item.text">
                  {{ item.text }}
                </span>
              </li>
            </ul>

            <UiButtonV2
              to="/auth/registration"
              class="hero__cta">
              {{ t("landing.sections.welcomeV2.cta") }}
            </UiButtonV2>
          </div>
        </div>
      </div>

      <div
        class="hero__visual"
        aria-hidden="true">
        <div class="hero__visual-stage">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="hero__visual-slide"
            :class="{ 'is-active': index === currentSlide }"
            :style="getSlideStyle(index)">
            <template v-if="slide.assets.length || slide.showBanner">
              <UiHomeBannerV2
                v-if="slide.showBanner"
                class="hero__asset hero__asset--slide2-city" />

              <img
                v-for="asset in slide.assets"
                :key="asset.className"
                :src="asset.src"
                alt=""
                aria-hidden="true"
                :class="asset.className" />

              <div
                v-if="slide.showLogo"
                class="hero__logo-wrap">
                <img
                  :src="FrameLogo"
                  alt=""
                  class="hero__asset hero__asset--center" />
                <UiIconLogo class="hero__logo" />
              </div>
            </template>

            <div
              v-else
              class="hero__visual-empty" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import type { CSSProperties } from "vue";
  import { useI18n } from "vue-i18n";
  import UiIconLogo from "~/components/ui/UiIconLogo.vue";
  import UiButtonV2 from "~/components/ui/UiButtonV2.vue";
  import UiHomeBannerV2 from "~/components/ui/UiHomeBannerV2.vue";
  import benefitCloud from "~/assets/landing/welcome-v2/benefit-cloud.svg";
  import benefitCurveArrow from "~/assets/landing/welcome-v2/benefit-curve-arrow.svg";
  import benefitGem from "~/assets/landing/welcome-v2/benefit-gem.svg";
  import devicesIcon from "~/assets/landing/welcome-v2/devices.svg";
  import settingsIcon from "~/assets/landing/welcome-v2/settings.svg";
  import visualCard1 from "~/assets/landing/welcome-v2/visual-card-1.svg";
  import visualCard2 from "~/assets/landing/welcome-v2/visual-card-2.svg";
  import visualCard3 from "~/assets/landing/welcome-v2/visual-card-3.svg";
  import visualCard4 from "~/assets/landing/welcome-v2/visual-card-4.svg";
  import visualCard5 from "~/assets/landing/welcome-v2/visual-card-5.svg";
  import visualCard6 from "~/assets/landing/welcome-v2/visual-card-6.svg";
  import visualMain from "~/assets/landing/welcome-v2/visual-card-main.svg";
  import grayShadow from "~/assets/landing/welcome-v2/gray-shadow.svg";
  import frame22 from "~/assets/landing/welcome-v2/Frame-22.svg";
  import frame24 from "~/assets/landing/welcome-v2/Frame-24.svg";
  import frame25 from "~/assets/landing/welcome-v2/Frame-25.svg";
  import tradingIcon from "~/assets/landing/welcome-v2/trading.svg";
  import databaseIcon from "~/assets/landing/welcome-v2/database.svg";
  import frame222 from "~/assets/landing/welcome-v2/Frame-222.svg";
  import frame16 from "~/assets/landing/welcome-v2/Frame-16.svg";
  import frame23 from "~/assets/landing/welcome-v2/Frame-23.svg";
  import monitor from "~/assets/landing/welcome-v2/monitor.svg";
  import FrameLogo from "~/assets/landing/welcome-v2/FramLogo.svg";

  const { t } = useI18n();

  const mkSlide = (
    i: number,
    icons: { icon: string; benefitIndex: number }[],
    extra: {
      showLogo: boolean;
      showBanner?: boolean;
      assets: { src: string; className: string }[];
    }
  ) => ({
    id: `slide-${i + 1}`,
    line1Prefix: t(`landing.sections.welcomeV2.slides[${i}].line1Prefix`),
    line1Accent: t(`landing.sections.welcomeV2.slides[${i}].line1Accent`),
    line1Suffix: t(`landing.sections.welcomeV2.slides[${i}].line1Suffix`),
    line2Prefix: t(`landing.sections.welcomeV2.slides[${i}].line2Prefix`),
    line2Accent: t(`landing.sections.welcomeV2.slides[${i}].line2Accent`),
    line2Suffix: t(`landing.sections.welcomeV2.slides[${i}].line2Suffix`),
    subtitle: t(`landing.sections.welcomeV2.slides[${i}].subtitle`),
    showCta: true,
    showBanner: extra.showBanner ?? false,
    benefits: icons.map(({ icon, benefitIndex }) => ({
      icon,
      text: t(`landing.sections.welcomeV2.slides[${i}].benefits[${benefitIndex}]`),
    })),
    ...extra,
  });

  const slides = computed(() => [
    mkSlide(
      0,
      [
        { icon: benefitCloud, benefitIndex: 0 },
        { icon: benefitCurveArrow, benefitIndex: 1 },
        { icon: benefitGem, benefitIndex: 2 },
      ],
      {
        showLogo: true,
        assets: [
          { src: grayShadow, className: "hero__asset hero__asset--gray-shadow" },
          { src: visualMain, className: "hero__asset hero__asset--main" },
          { src: visualCard1, className: "hero__asset hero__asset--card-1" },
          { src: visualCard2, className: "hero__asset hero__asset--card-2" },
          { src: visualCard3, className: "hero__asset hero__asset--card-3" },
          { src: visualCard4, className: "hero__asset hero__asset--card-4" },
          { src: visualCard5, className: "hero__asset hero__asset--card-5" },
          { src: visualCard6, className: "hero__asset hero__asset--card-6" },
        ],
      }
    ),
    mkSlide(
      1,
      [
        { icon: settingsIcon, benefitIndex: 0 },
        { icon: devicesIcon, benefitIndex: 1 },
      ],
      {
        showLogo: false,
        showBanner: true,
        assets: [
          { src: frame22, className: "hero__asset hero__asset--slide2-card-top" },
          { src: frame25, className: "hero__asset hero__asset--slide2-card-left" },
          { src: frame24, className: "hero__asset hero__asset--slide2-card-center" },
        ],
      }
    ),
    mkSlide(
      2,
      [
        { icon: databaseIcon, benefitIndex: 0 },
        { icon: tradingIcon, benefitIndex: 1 },
      ],
      {
        showLogo: false,
        assets: [
          { src: monitor, className: "hero__asset hero__asset--slide3-monitor" },
          { src: frame16, className: "hero__asset hero__asset--slide3-card-main" },
          { src: frame23, className: "hero__asset hero__asset--slide3-card-left" },
          { src: frame222, className: "hero__asset hero__asset--slide3-card-bottom" },
        ],
      }
    ),
  ]);

  const AUTO_PLAY_DELAY = 10000;
  const SWIPE_THRESHOLD_RATIO = 0.14;

  const heroRef = ref<HTMLElement | null>(null);
  const currentSlide = ref(0);
  const isDragging = ref(false);
  const dragOffsetPx = ref(0);
  const activePointerId = ref<number | null>(null);
  const dragStartX = ref(0);
  let slideIntervalId: ReturnType<typeof setInterval> | null = null;

  const normalizeIndex = (index: number) => {
    const total = slides.value.length;
    return ((index % total) + total) % total;
  };

  const goLeft = () => {
    currentSlide.value = normalizeIndex(currentSlide.value + 1);
  };

  const goRight = () => {
    currentSlide.value = normalizeIndex(currentSlide.value - 1);
  };

  const stopAutoPlay = () => {
    if (!slideIntervalId) return;
    clearInterval(slideIntervalId);
    slideIntervalId = null;
  };

  const startAutoPlay = () => {
    if (slides.value.length <= 1) return;
    stopAutoPlay();
    slideIntervalId = setInterval(() => {
      goRight();
    }, AUTO_PLAY_DELAY);
  };

  const resetAutoPlay = () => {
    startAutoPlay();
  };

  const getRelativePosition = (index: number) => {
    const total = slides.value.length;
    let delta = index - currentSlide.value;
    const half = total / 2;

    if (delta > half) delta -= total;
    if (delta < -half) delta += total;

    return delta;
  };

  const getSlideStyle = (index: number): CSSProperties => {
    const offset = getRelativePosition(index);
    const isVisible = Math.abs(offset) <= 1;

    return {
      transform: `translate3d(calc(${offset * 100}% + ${dragOffsetPx.value}px), 0, 0)`,
      opacity: isVisible || index === currentSlide.value ? "1" : "0",
      zIndex: index === currentSlide.value ? "2" : "1",
      pointerEvents: index === currentSlide.value ? "auto" : "none",
    };
  };

  const finishDrag = (deltaX = 0) => {
    const width = heroRef.value?.clientWidth ?? 1;
    const threshold = width * SWIPE_THRESHOLD_RATIO;

    if (deltaX >= threshold) {
      goRight();
    } else if (deltaX <= -threshold) {
      goLeft();
    }

    dragOffsetPx.value = 0;
    isDragging.value = false;
    activePointerId.value = null;
    resetAutoPlay();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (slides.value.length <= 1) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, input, textarea, select, label")) return;

    activePointerId.value = event.pointerId;
    dragStartX.value = event.clientX;
    dragOffsetPx.value = 0;
    isDragging.value = true;
    stopAutoPlay();
    heroRef.value?.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (activePointerId.value !== event.pointerId || !isDragging.value) return;
    dragOffsetPx.value = event.clientX - dragStartX.value;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (activePointerId.value !== event.pointerId) return;
    heroRef.value?.releasePointerCapture?.(event.pointerId);
    finishDrag(event.clientX - dragStartX.value);
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (activePointerId.value !== event.pointerId) return;
    heroRef.value?.releasePointerCapture?.(event.pointerId);
    finishDrag();
  };

  onMounted(() => {
    startAutoPlay();
  });

  onUnmounted(() => {
    stopAutoPlay();
  });
</script>

<style lang="scss" scoped>
  @keyframes levitate {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes hero-text-shine {
    0% {
      background-position: 160% 50%;
    }
    100% {
      background-position: -60% 50%;
    }
  }

  .welcome-v2 {
    position: relative;
    padding-top: 118px;
    z-index: 0;
  }

  .hero {
    position: relative;
    z-index: 0;
    width: 100%;
    margin: 0 auto;
    padding: 0 40px 0;
    display: grid;
    grid-template-columns: minmax(635px, 1fr) minmax(520px, 1fr);
    gap: 10px;
    min-height: calc(100vh - 230px);
    background: #f6f6f6;
    align-items: center;
    overflow: visible;
    isolation: auto;
    touch-action: pan-y;
    cursor: grab;

    &--dragging {
      cursor: grabbing;
      user-select: none;
    }

    > * {
      min-width: 0;
    }

    &__glows {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      overflow: visible;
    }

    &__shimmer {
      position: relative;
      display: inline-block;
      white-space: pre-wrap;

      &::after {
        content: attr(data-text);
        position: absolute;
        inset: 0;
        pointer-events: none;
        color: transparent;
        background-repeat: no-repeat;
        background-size: 220% 100%;
        background-position: 160% 50%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: hero-text-shine 5.6s ease-in-out infinite;
      }

      &--title {
        color: #111111;

        &::after {
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(255, 255, 255, 0.04) 48%,
            rgba(255, 255, 255, 0.28) 50%,
            rgba(255, 255, 255, 0.04) 52%,
            rgba(255, 255, 255, 0) 56%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      }

      &--accent {
        color: #0051ff;

        &::after {
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(255, 255, 255, 0.05) 48%,
            rgba(255, 255, 255, 0.32) 50%,
            rgba(255, 255, 255, 0.05) 52%,
            rgba(255, 255, 255, 0) 56%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      }

      &--muted {
        color: #7b7b7b;

        &::after {
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(255, 255, 255, 0.03) 48%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.03) 52%,
            rgba(255, 255, 255, 0) 56%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      }

      &--benefit {
        color: #111111;

        &::after {
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(255, 255, 255, 0.03) 48%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.03) 52%,
            rgba(255, 255, 255, 0) 56%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      }
    }

    &__title {
      margin: 0;
      font-family: "DM Sans", sans-serif;
      font-size: 62px;
      font-weight: 400;
      line-height: 0.9756;
      letter-spacing: -0.03em;
      max-width: 640px;
      width: 100%;
      z-index: 2;
    }

    &__subtitle {
      margin: 40px 0 0;
      max-width: 493px;
      font-size: 16px;
      line-height: 1.302;
      font-weight: 400;
    }

    &__benefits {
      margin: 45px 0 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 27px;

      li {
        display: flex;
        align-items: center;
        gap: 16px;
        font-weight: 500;
        font-size: 16px;
        line-height: 1.302;

        img {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
      }
    }

    &__cta {
      margin-top: 43px;
      width: 325px;
      align-self: flex-start;
    }

    &__content {
      position: relative;
      min-height: 420px;
      z-index: 2;
      overflow: hidden;
    }

    &__content-stage {
      position: relative;
      min-height: inherit;
    }

    &__content-slide {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      transition:
        transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.45s ease;
      will-change: transform, opacity;
    }

    &__visual {
      position: relative;
      min-height: 615px;
      z-index: 1;
    }

    &__visual-stage {
      position: relative;
      min-height: inherit;
      clip-path: inset(-340px -240px -120px -120px);
    }

    &__visual-slide {
      position: absolute;
      inset: 0;
      transition:
        transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.45s ease;
      will-change: transform, opacity;
    }

    &__visual-empty {
      width: 100%;
      height: 100%;
    }

    &__asset {
      position: absolute;
      z-index: 1;

      &--main {
        left: 108px;
        top: 0;
        width: 192px;
      }

      &--gray-shadow {
        top: -300px;
        right: -160px;
        width: 622px;
        z-index: -1;
        pointer-events: none;
      }

      &--card-1 {
        left: 409px;
        top: 31px;
        width: 114px;
      }

      &--card-2 {
        left: 0;
        top: 223px;
        width: 148px;
      }

      &--card-3 {
        left: 575px;
        top: 211px;
        width: 86px;
      }

      &--card-4 {
        left: 361px;
        top: 514px;
        width: 86px;
      }

      &--card-5 {
        left: 148px;
        top: 425px;
        width: 114px;
      }

      &--card-6 {
        left: 535px;
        top: 405px;
        width: 114px;
      }

      &--slide2-city {
        top: -40px;
        right: -110px;
        width: 640px;
        z-index: -1;
        pointer-events: none;
      }

      &--slide2-card-top {
        left: 230px;
        top: 80px;
        width: 161px;
      }

      &--slide2-card-left {
        left: 130px;
        top: 360px;
        width: 161px;
      }

      &--slide2-card-center {
        left: 360px;
        top: 260px;
        width: 225px;
      }

      &--slide3-monitor {
        top: -86px;
        right: -136px;
        width: 690px;
        z-index: -1;
        pointer-events: none;
      }

      &--slide3-card-main {
        left: 120px;
        top: 90px;
        width: 237px;
      }

      &--slide3-card-left {
        left: 60px;
        top: 400px;
        width: 134px;
      }

      &--slide3-card-bottom {
        left: 340px;
        top: 375px;
        width: 188px;
      }

      &--center {
        width: 217px;
      }

      &--main {
        animation: levitate 4s ease-in-out infinite;
        animation-delay: 0s;
      }

      &--card-1 {
        animation: levitate 3.5s ease-in-out infinite;
        animation-delay: -0.5s;
      }

      &--card-2 {
        animation: levitate 4.5s ease-in-out infinite;
        animation-delay: -1s;
      }

      &--card-3 {
        animation: levitate 3.2s ease-in-out infinite;
        animation-delay: -1.5s;
      }

      &--card-4 {
        animation: levitate 4s ease-in-out infinite;
        animation-delay: -2s;
      }

      &--card-5 {
        animation: levitate 3.8s ease-in-out infinite;
        animation-delay: -0.8s;
      }

      &--card-6 {
        animation: levitate 4.2s ease-in-out infinite;
        animation-delay: -1.2s;
      }

      &--slide2-card-top {
        animation: levitate 3.8s ease-in-out infinite;
        animation-delay: 0s;
      }

      &--slide2-card-left {
        animation: levitate 4.2s ease-in-out infinite;
        animation-delay: -1s;
      }

      &--slide2-card-center {
        animation: levitate 3.5s ease-in-out infinite;
        animation-delay: -0.5s;
      }

      &--slide3-card-main {
        animation: levitate 4s ease-in-out infinite;
        animation-delay: 0s;
      }

      &--slide3-card-left {
        animation: levitate 3.6s ease-in-out infinite;
        animation-delay: -0.8s;
      }

      &--slide3-card-bottom {
        animation: levitate 4.4s ease-in-out infinite;
        animation-delay: -1.4s;
      }
    }

    &__logo-wrap {
      position: absolute;
      left: 272px;
      top: 212px;
      width: 217px;
      height: 240px;
      animation: levitate 4s ease-in-out infinite;
      animation-delay: -0.3s;
    }

    &__logo {
      position: absolute;
      width: 140px;
      height: auto;
      left: 39px;
      top: 89px;
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      z-index: -2;
      pointer-events: none;

      &--blue-1 {
        width: 183px;
        height: 183px;
        background: #0052fe;
        left: -105px;
        top: 752px;
        filter: blur(200px);
      }

      &--blue-2 {
        width: 105px;
        height: 105px;
        background: #0052fe;
        left: calc(100% - 355px);
        top: 451px;
        filter: blur(120px);
      }

      &--orange-1 {
        width: 58px;
        height: 58px;
        background: #f75709;
        left: calc(100% - 670px);
        top: 233px;
        filter: blur(75px);
      }

      &--orange-2 {
        width: 58px;
        height: 58px;
        background: #f75709;
        left: calc(100% - 380px);
        top: 845px;
        filter: blur(75px);
      }
    }
  }

  .hero--dragging .hero__content-slide,
  .hero--dragging .hero__visual-slide {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__shimmer::after,
    .hero__asset--main,
    .hero__asset--card-1,
    .hero__asset--card-2,
    .hero__asset--card-3,
    .hero__asset--card-4,
    .hero__asset--card-5,
    .hero__asset--card-6,
    .hero__asset--slide2-card-top,
    .hero__asset--slide2-card-left,
    .hero__asset--slide2-card-center,
    .hero__asset--slide3-card-main,
    .hero__asset--slide3-card-left,
    .hero__asset--slide3-card-bottom,
    .hero__logo-wrap {
      animation: none !important;
    }

    .hero__content-slide,
    .hero__visual-slide {
      transition: none !important;
    }
  }

  @media (max-width: 1279px) {
    .welcome-v2 {
      padding-top: 104px;
      padding-inline: 20px;
    }

    .hero {
      min-height: calc(100vh - 230px);
      padding: 0 24px 0;
      grid-template-columns: minmax(420px, 560px) minmax(420px, 1fr);

      &__asset--gray-shadow {
        display: none;
      }

      &__title {
        font-size: 64px;
      }

      &__visual {
        transform: scale(0.82);
        transform-origin: top center;
      }

      &__content {
        min-height: 360px;
      }
    }
  }

  @media (max-width: 991px) {
    .welcome-v2 {
      padding-inline: 20px;
    }

    .hero {
      min-height: auto;
      padding: 48px 20px 20px;
      grid-template-columns: 1fr;
      gap: 12px;

      &__title {
        font-size: 44px;
        line-height: 1.04;
        letter-spacing: -0.02em;
      }

      &__subtitle {
        margin-top: 24px;
        font-size: 16px;
      }

      &__benefits {
        margin-top: 32px;
        gap: 20px;
      }

      &__cta {
        width: 100%;
        margin-top: 32px;
      }

      &__content {
        min-height: 280px;
      }

      &__visual {
        min-height: 500px;
        transform: scale(0.75);
        transform-origin: top left;
      }

      &__asset--slide2-city {
        top: 40px;
        width: 640px;
        right: revert-layer;
      }

      &__asset--slide3-monitor {
        top: -60px;
        right: -100px;
        width: 800px;
      }
    }
  }

  @media (max-width: 575px) {
    .welcome-v2 {
      padding-inline: 12px;
    }

    .hero {
      &__title {
        font-size: 38px;
      }

      &__cta {
        width: 100%;
      }

      &__content {
        min-height: 240px;
      }

      &__visual {
        min-height: 340px;
        transform: scale(0.5);
      }

      &__glow {
        display: none;
      }

      &__asset--slide2-city {
        top: 40px;
        width: 640px;
        right: revert-layer;
      }

      &__asset--slide3-monitor {
        top: -40px;
        right: -80px;
        width: 750px;
      }
    }
  }
</style>
