<template>
  <section class="welcome-v2">
    <div class="hero">
      <div
        class="hero__glows"
        aria-hidden="true">
        <span class="hero__glow hero__glow--blue-1"></span>
        <span class="hero__glow hero__glow--blue-2"></span>
        <span class="hero__glow hero__glow--orange-1"></span>
        <span class="hero__glow hero__glow--orange-2"></span>
      </div>

      <img
        v-if="isFirstSlideActive"
        :src="grayShadow"
        alt=""
        aria-hidden="true"
        class="hero__backdrop hero__backdrop--gray-shadow" />

      <Swiper
        class="hero__slider"
        :modules="swiperModules"
        :slides-per-view="1"
        :loop="slides.length > 1"
        :speed="900"
        :allow-touch-move="slides.length > 1"
        :grab-cursor="slides.length > 1"
        :simulate-touch="slides.length > 1"
        :threshold="8"
        :touch-angle="30"
        :long-swipes-ratio="0.18"
        :watch-overflow="true"
        :prevent-clicks="true"
        :prevent-clicks-propagation="true"
        :autoplay="autoplayOptions"
        @swiper="onSwiperReady"
        @slideChange="onSlideChange">
        <SwiperSlide
          v-for="slide in slides"
          :key="slide.id"
          class="hero__slide">
          <div class="hero__content">
            <div class="w-full max-w-[715px]">
              <h1 class="hero__title">
                <template
                  v-for="(line, lineIndex) in slide.titleLines"
                  :key="lineIndex">
                  <template
                    v-for="(segment, segmentIndex) in line"
                    :key="`${lineIndex}-${segmentIndex}-${segment.text}`">
                    {{ segmentIndex > 0 && !segment.joinBefore ? " " : ""
                    }}<span
                      class="hero__shimmer hero__title-segment"
                      :class="segment.tone === 'accent' ? 'hero__shimmer--accent' : 'hero__shimmer--title'"
                      :data-text="segment.text">
                      {{ segment.text }}
                    </span>
                  </template>
                  <br v-if="lineIndex < slide.titleLines.length - 1" />
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
                :to="cabinetLink('/auth/registration')"
                class="hero__cta">
                {{ t("landing.sections.welcomeV2.cta") }}
              </UiButtonV2>
            </div>
          </div>

          <div
            class="hero__visual"
            aria-hidden="true">
            <div class="hero__visual-stage w-full max-w-[715px]">
              <template v-if="slide.assets.length || slide.showBanner">
                <component
                  :is="themeStore.currentTheme === 'dark' ? UiHomeBannerV2Night : UiHomeBannerV2"
                  v-if="slide.showBanner"
                  class="hero__asset hero__asset--slide2-city" />

                <span
                  v-for="(asset, index) in slide.assets"
                  :key="asset.className"
                  aria-hidden="true"
                  :class="[
                    asset.className,
                    asset.kind === 'hex' ? 'hero__asset-wrap--hex' : '',
                    asset.tone ? `hero__asset-wrap--${asset.tone}` : '',
                  ]">
                  <img
                    :src="asset.src"
                    alt=""
                    class="hero__asset-img" />
                </span>

                <div
                  v-if="slide.showLogo"
                  class="hero__logo-wrap hero__asset-wrap--hex hero__asset-wrap--mixed">
                  <img
                    :src="visualCenterFrame"
                    alt=""
                    class="hero__asset hero__asset--center" />
                  <component
                    :is="themeStore.currentTheme === 'dark' ? UiIconLogo : UiIconLogoLight"
                    class="hero__logo" />
                </div>
              </template>

              <div
                v-else
                class="hero__visual-empty" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Autoplay } from "swiper/modules";
  import "swiper/css";
  import UiIconLogo from "~/components/ui/UiIconLogo.vue";
  import UiIconLogoLight from "~/components/ui/UiIconLogoLight.vue";
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
  import monitor from "~/assets/landing/welcome-v2/monitor.png";
  import visualCenterFrame from "~/assets/landing/welcome-v2/visual-center-frame.svg";
  import UiHomeBannerV2Night from "~/components/ui/UiHomeBannerV2Night.vue";
  import { useCabinetLink } from "~/composables/useCabinetLink";
  import { useThemeStore } from "~/stores/themeStore";

  const { t } = useI18n();
  const { cabinetLink } = useCabinetLink();
  const themeStore = useThemeStore();

  const currentSlideIndex = ref(0);

  const setCurrentSlideIndex = (swiper: any) => {
    currentSlideIndex.value = Number.isFinite(swiper.realIndex)
      ? swiper.realIndex
      : Number.isFinite(swiper.activeIndex)
        ? swiper.activeIndex
        : 0;
  };

  const onSwiperReady = (swiper: any) => {
    setCurrentSlideIndex(swiper);
  };

  const onSlideChange = (swiper: any) => {
    setCurrentSlideIndex(swiper);
  };

  const isFirstSlideActive = computed(() => currentSlideIndex.value === 0);

  type HeroTitleSegment = {
    text: string;
    tone: "title" | "accent";
    joinBefore: boolean;
  };

  type HeroAsset = {
    src: string;
    className: string;
    kind?: "hex";
    tone?: "primary" | "warning" | "mixed";
  };

  const ATTACHED_PUNCTUATION = /^[.,!?;:。،؛؟।]+$/u;
  const NO_SPACE_BEFORE = /^[-–—.,!?;:)\]}。،؛؟।]/u;

  const normalizeTitlePart = (value: string) => value.replace(/\s+/g, " ").trim();

  const addTitleSegment = (line: HeroTitleSegment[], value: string, tone: HeroTitleSegment["tone"]) => {
    const text = normalizeTitlePart(value);

    if (!text) return;

    if (ATTACHED_PUNCTUATION.test(text) && line.length) {
      line[line.length - 1].text += text;
      return;
    }

    line.push({
      text,
      tone,
      joinBefore: line.length > 0 && NO_SPACE_BEFORE.test(text),
    });
  };

  const buildTitleLine = (
    prefix: string,
    accent: string,
    suffix: string,
    accentTone: HeroTitleSegment["tone"] = "accent"
  ) => {
    const line: HeroTitleSegment[] = [];

    addTitleSegment(line, prefix, "title");
    addTitleSegment(line, accent, accentTone);
    addTitleSegment(line, suffix, "title");

    return line;
  };

  const buildTitleLines = (slideIndex: number) => {
    const lines = [
      buildTitleLine(
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line1Prefix`),
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line1Accent`),
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line1Suffix`)
      ),
      buildTitleLine(
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line2Prefix`),
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line2Accent`),
        t(`landing.sections.welcomeV2.slides[${slideIndex}].line2Suffix`)
      ),
    ];

    return lines.filter(line => line.length);
  };

  const mkSlide = (
    i: number,
    icons: { icon: string; benefitIndex: number }[],
    extra: {
      showLogo: boolean;
      showBanner?: boolean;
      assets: HeroAsset[];
    }
  ) => ({
    id: `slide-${i + 1}`,
    titleLines: buildTitleLines(i),
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
          { src: visualMain, className: "hero__asset hero__asset--main", kind: "hex", tone: "mixed" },
          { src: visualCard1, className: "hero__asset hero__asset--card-1", kind: "hex", tone: "primary" },
          { src: visualCard2, className: "hero__asset hero__asset--card-2", kind: "hex", tone: "warning" },
          { src: visualCard3, className: "hero__asset hero__asset--card-3", kind: "hex", tone: "primary" },
          { src: visualCard4, className: "hero__asset hero__asset--card-4", kind: "hex", tone: "warning" },
          { src: visualCard5, className: "hero__asset hero__asset--card-5", kind: "hex", tone: "mixed" },
          { src: visualCard6, className: "hero__asset hero__asset--card-6", kind: "hex", tone: "primary" },
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
          { src: frame22, className: "hero__asset hero__asset--slide2-card-top", kind: "hex", tone: "warning" },
          { src: frame25, className: "hero__asset hero__asset--slide2-card-left", kind: "hex", tone: "primary" },
          { src: frame24, className: "hero__asset hero__asset--slide2-card-center", kind: "hex", tone: "mixed" },
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
          { src: frame16, className: "hero__asset hero__asset--slide3-card-main", kind: "hex", tone: "mixed" },
          { src: frame23, className: "hero__asset hero__asset--slide3-card-left", kind: "hex", tone: "primary" },
          { src: frame222, className: "hero__asset hero__asset--slide3-card-bottom", kind: "hex", tone: "warning" },
        ],
      }
    ),
  ]);

  const AUTO_PLAY_DELAY = 10000;
  const swiperModules = [Autoplay];
  const autoplayOptions = computed(() =>
    slides.value.length > 1
      ? {
          delay: AUTO_PLAY_DELAY,
          disableOnInteraction: false,
          reverseDirection: true,
        }
      : false
  );
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

  @keyframes hero-hex-glow {
    0%,
    100% {
      opacity: 0.34;
      transform: scale(0.98);
      filter: blur(18px);
    }
    50% {
      opacity: 0.58;
      transform: scale(1.04);
      filter: blur(22px);
    }
  }

  @keyframes hero-hex-tint {
    0%,
    100% {
      opacity: 0.82;
    }
    50% {
      opacity: 0.98;
    }
  }

  .welcome-v2 {
    position: relative;
    padding-top: 118px;
    z-index: 0;
    height: calc(100vh - 125px);
    max-height: 1000px;
    display: flex;
    align-items: center;
  }

  .hero {
    position: relative;
    z-index: 0;
    width: 100%;
    margin: 0 auto;
    background: var(--landing-bg);
    overflow: visible;
    isolation: auto;

    &__glows {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      overflow: visible;
    }

    &__slider {
      position: relative;
      z-index: 1;
      overflow: visible;

      :deep(.swiper-wrapper) {
        align-items: stretch;
      }

      :deep(.swiper-slide) {
        height: auto;
      }
    }

    &__backdrop {
      position: absolute;
      z-index: 0;
      pointer-events: none;
      user-select: none;
    }

    &__backdrop--gray-shadow {
      top: -65%;
      right: 0;
      width: clamp(560px, 36vw, 720px);
      opacity: var(--landing-hero-backdrop-opacity);
      filter: var(--landing-hero-backdrop-filter);
      mix-blend-mode: var(--landing-hero-backdrop-blend);
      transition:
        opacity 0.3s ease,
        filter 0.3s ease;
    }

    &__slide {
      display: grid;
      grid-template-columns: minmax(635px, 1fr) minmax(520px, 1fr);
      gap: 10px;
      height: calc(100vh - 230px);
      padding: 0 40px 0;
      box-sizing: border-box;
      align-items: center;

      > * {
        min-width: 0;
      }
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
        color: var(--landing-text-strong);

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
        color: var(--landing-accent);

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
        color: var(--landing-text-secondary);

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
        color: var(--landing-text-strong);

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
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    &__visual {
      position: relative;
      min-height: 615px;
      z-index: 1;
      overflow: visible;
    }

    &__visual-stage {
      position: relative;
      min-height: inherit;
      overflow: visible;
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
        right: 0;
        width: 640px;
        z-index: -1;
        pointer-events: none;
        opacity: var(--landing-hero-backdrop-opacity);
        filter: var(--landing-hero-backdrop-filter);
        mix-blend-mode: var(--landing-hero-backdrop-blend);
        transition:
          opacity 0.3s ease,
          filter 0.3s ease;
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
        position: absolute;
        right: -100px;
        max-width: 715px;
        max-height: 615px;
        width: 100%;
        height: 562px;
        z-index: -1;
        pointer-events: none;
        opacity: var(--landing-hero-screen-opacity);
        filter: var(--landing-hero-screen-filter);
        transition:
          opacity 0.3s ease,
          filter 0.3s ease;
        object-fit: cover;
        object-position: left center;
        overflow: visible;
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

    &__asset-img {
      display: block;
      width: 100%;
      height: auto;
      position: relative;
      z-index: 1;
    }

    &__asset-wrap--hex {
      isolation: isolate;
      filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.1));

      &::before,
      &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &::before {
        display: none;
        inset: 0;
        z-index: 0;
        background:
          radial-gradient(circle at 30% 24%, rgba(74, 124, 255, 0.22), transparent 46%),
          linear-gradient(145deg, rgba(18, 42, 88, 0.86), rgba(7, 22, 54, 0.76));
        box-shadow:
          inset 0 0 0 2px rgba(95, 131, 198, 0.18),
          inset 0 -22px 40px rgba(0, 8, 32, 0.18);
      }

      &::after {
        inset: -12%;
        z-index: -1;
        border-radius: 999px;
        background:
          radial-gradient(circle at 36% 32%, rgba(27, 99, 255, 0.28), transparent 48%),
          radial-gradient(circle at 74% 68%, rgba(255, 139, 77, 0.13), transparent 58%);
      }
    }

    &__asset-wrap--warning::before {
      background:
        radial-gradient(circle at 72% 26%, rgba(255, 139, 77, 0.15), transparent 44%),
        linear-gradient(145deg, rgba(18, 42, 88, 0.84), rgba(7, 22, 54, 0.76));
    }

    &__asset-wrap--mixed::before {
      background:
        radial-gradient(circle at 34% 25%, rgba(42, 111, 255, 0.22), transparent 44%),
        radial-gradient(circle at 70% 70%, rgba(255, 139, 77, 0.1), transparent 52%),
        linear-gradient(145deg, rgba(19, 43, 88, 0.88), rgba(7, 22, 54, 0.76));
    }

    &__asset--slide3-monitor &__asset-img {
      height: 100%;
      object-fit: cover;
      object-position: left center;
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
      z-index: 3;
    }

    &__logo.logo-flat {
      width: 140px;
      height: auto;
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      z-index: -2;
      pointer-events: none;

      &--blue-1 {
        width: 183px;
        height: 183px;
        background: var(--landing-glow-blue);
        left: -105px;
        top: 752px;
        filter: blur(200px);
      }

      &--blue-2 {
        width: 105px;
        height: 105px;
        background: var(--landing-glow-blue);
        left: calc(100% - 355px);
        top: 451px;
        filter: blur(120px);
      }

      &--orange-1 {
        width: 58px;
        height: 58px;
        background: var(--landing-glow-orange);
        left: calc(100% - 670px);
        top: 233px;
        filter: blur(75px);
      }

      &--orange-2 {
        width: 58px;
        height: 58px;
        background: var(--landing-glow-orange);
        left: calc(100% - 380px);
        top: 845px;
        filter: blur(75px);
      }
    }
  }

  :global(:root[data-theme="dark"] .hero__asset-wrap--hex::after) {
    opacity: 0;
    animation: none;
  }

  :global(:root[data-theme="dark"] .hero__asset-wrap--hex .hero__asset-img) {
    opacity: 1;
    filter: invert(82%) sepia(19%) saturate(777%) hue-rotate(184deg) brightness(139%) contrast(169%);
    mix-blend-mode: normal;
  }

  :global(:root[data-theme="dark"] .hero__logo-wrap > .hero__asset--center) {
    opacity: 1;
    filter: invert(82%) sepia(19%) saturate(777%) hue-rotate(184deg) brightness(139%) contrast(169%);
    mix-blend-mode: normal;
  }

  :global(:root[data-theme="dark"] .hero__logo-wrap .hero__logo) {
    opacity: 1;
    filter: none;
  }

  :global(:root[data-theme="dark"] .hero__asset-wrap--hex) {
    filter: none;
  }

  :global(:root[data-theme="dark"] .hero__backdrop--gray-shadow) {
    opacity: 1;
    filter: invert(82%) sepia(19%) saturate(777%) hue-rotate(184deg) brightness(139%) contrast(169%);
    mix-blend-mode: normal;
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
    .hero__logo-wrap,
    .hero__asset-wrap--hex::before,
    .hero__asset-wrap--hex::after {
      animation: none !important;
    }
  }

  @media (max-width: 1279px) {
    .welcome-v2 {
      padding-top: 104px;
      padding-inline: 20px;
    }

    .hero {
      &__slide {
        min-height: calc(100vh - 230px);
        padding: 0 24px 0;
        grid-template-columns: minmax(420px, 560px) minmax(420px, 1fr);
      }

      &__backdrop--gray-shadow {
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
      height: auto;
      max-height: none;
      min-height: calc(100svh - 88px);
      align-items: flex-start;
      padding: 96px 20px 28px;
    }

    .hero {
      &__slider {
        overflow: hidden;
      }

      &__slide {
        height: auto;
        min-height: auto;
        padding: 24px 0 0;
        grid-template-columns: 1fr;
        gap: 26px;
        align-items: start;
        overflow: hidden;
      }

      &__title {
        max-width: 560px;
        margin-inline: auto;
        font-size: clamp(38px, 7vw, 54px);
        line-height: 1.03;
        letter-spacing: -0.02em;
        text-align: center;
      }

      &__subtitle {
        max-width: 520px;
        margin: 22px auto 0;
        font-size: 16px;
        text-align: center;
      }

      &__benefits {
        width: min(100%, 500px);
        margin: 30px auto 0;
        gap: 18px;

        li {
          align-items: flex-start;
          text-align: left;
        }
      }

      &__cta {
        width: min(100%, 360px);
        margin: 30px auto 0;
      }

      &__content {
        min-height: 0;
        align-items: center;
        text-align: center;

        > div {
          max-width: 620px;
          margin-inline: auto;
        }
      }

      &__visual {
        position: relative;
        width: 100%;
        height: 418px;
        min-height: 0;
        margin-top: 0;
        overflow: hidden;
        transform: none;
      }

      &__visual-stage {
        position: absolute;
        top: 0;
        left: 50%;
        width: 715px;
        min-width: 715px;
        max-width: none;
        height: 615px;
        min-height: 0;
        transform: translateX(-50%) scale(0.68);
        transform-origin: top center;
      }

      &__backdrop--gray-shadow,
      &__asset--slide2-city {
        display: none;
      }

      &__asset--slide3-monitor {
        right: -30px;
        width: 715px;
      }
    }
  }

  @media (max-width: 575px) {
    .welcome-v2 {
      min-height: calc(100svh - 76px);
      padding: 86px 12px 24px;
    }

    .hero {
      &__title {
        font-size: clamp(31px, 9.2vw, 38px);
        line-height: 1.05;
      }

      &__subtitle {
        margin-top: 18px;
        font-size: 14px;
      }

      &__benefits {
        margin-top: 24px;
        gap: 14px;

        li {
          gap: 12px;
          font-size: 14px;

          img {
            width: 21px;
            height: 21px;
          }
        }
      }

      &__cta {
        width: min(100%, 336px);
        margin-top: 26px;
      }

      &__visual {
        height: 284px;
      }

      &__visual-stage {
        transform: translateX(-50%) scale(0.46);
      }

      &__glow {
        display: none;
      }

      &__asset--slide3-monitor {
        top: -24px;
        right: -30px;
        width: 715px;
      }
    }
  }

  @media (max-width: 420px) {
    .hero {
      &__visual {
        height: 260px;
      }

      &__visual-stage {
        transform: translateX(-50%) scale(0.42);
      }
    }
  }
</style>
