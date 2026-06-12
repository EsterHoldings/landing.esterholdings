<template>
  <section
    ref="viewport"
    class="news-row-v2"
    :class="{ 'news-row-v2--dragging': isDragging }"
    @scroll.passive="handleScroll"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
    @click.capture="handleClickCapture"
    @mouseenter="stopAnimation"
    @mouseleave="startAnimation">
    <div
      ref="track"
      class="news-row-v2__track">
      <NuxtLink
        v-for="loopItem in loopItems"
        :key="`${loopItem.copy}-${loopItem.item.link}-${loopItem.item.title}`"
        :to="loopItem.item.link"
        class="news-row-v2__card">
        <img
          :src="loopItem.item.image"
          :alt="loopItem.item.title"
          class="news-row-v2__thumb" />
        <p>{{ loopItem.item.title }}</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";
  import { useAsyncData } from "#app";
  import { useI18n } from "vue-i18n";
  import useAppCore from "~/composables/useAppCore";
  import { useInfiniteHorizontalLoop } from "~/composables/useInfiniteHorizontalLoop";

  const { t, tm, locale } = useI18n();
  const appCore = useAppCore();

  const images = [
    "https://render.fineartamerica.com/images/rendered/default/flat/beach-towel/images/artworkimages/medium/1/pixel-bitcoin-concept-allan-swart.jpg?&targetx=0&targety=-76&imagewidth=952&imageheight=628&modelwidth=952&modelheight=476&backgroundcolor=52514D&orientation=1&producttype=beachtowel-32-64",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4L9_huULFPV-ewqaz3Hpf9iGK0njUL-HvHQ&s",
    "https://d1-invdn-com.investing.com/content/07858a634c1563800bd81d442dfd96cf.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ecfGnvuktF2LkwRKXrzXlJfAKQ_Os9Vqrw&s",
  ];

  const { data: latestNews, refresh } = await useAsyncData("landing-news-row", async () => {
    const response = await appCore.news.getLatest({ limit: 4, locale: locale.value });
    return response.data.data;
  });

  const fallbackItems = computed(() => {
    const raw = tm("landing.sections.news_row__items") as any[];
    return Array.isArray(raw)
      ? raw.map((_, i) => ({
          title: t(`landing.sections.news_row__items[${i}].title`),
          image: images[i],
          link: localizedPath("/company-news"),
        }))
      : [];
  });

  const baseItems = computed(() => {
    const realItems = latestNews.value || [];
    if (realItems.length) {
      return realItems.map(item => ({
        title: item.title,
        image: item.image,
        link: item.urlPath || localizedPath(`/news/${item.slug}`),
      }));
    }

    return fallbackItems.value;
  });

  const viewport = ref<HTMLElement | null>(null);
  const track = ref<HTMLElement | null>(null);
  const speed = 0.4;
  const {
    copies,
    isDragging,
    resetLoopPosition,
    startAnimation,
    stopAnimation,
    handleScroll,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleClickCapture,
  } = useInfiniteHorizontalLoop(viewport, track, { speed });
  const loopItems = computed(() =>
    Array.from({ length: copies }, (_, copy) => baseItems.value.map(item => ({ copy, item }))).flat()
  );

  function localizedPath(path: string): string {
    return locale.value ? `/${locale.value}${path}` : path;
  }

  onMounted(() => {
    resetLoopPosition();
    window.setTimeout(() => resetLoopPosition(), 150);
    startAnimation();
  });

  onUnmounted(stopAnimation);

  watch(
    () => baseItems.value.length,
    () => resetLoopPosition()
  );

  watch(locale, async () => {
    await refresh();
    resetLoopPosition();
  });
</script>

<style lang="scss" scoped>
  .news-row-v2 {
    margin-top: 88px;
    overflow-x: hidden;
    overflow-y: hidden;
    cursor: grab;
    overscroll-behavior-x: contain;
    scroll-behavior: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &--dragging {
      cursor: grabbing;
    }

    &__track {
      width: max-content;
      margin: 0;
      display: flex;
      gap: 18px;
      will-change: transform;
    }

    &__card {
      width: 399px;
      border-radius: 20px;
      border: 1px solid var(--landing-border-strong);
      background: var(--landing-surface-glass);
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
      color: inherit;
      text-decoration: none;
      user-select: none;

      p {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 14px;
        line-height: 1.302;
        font-weight: 700;
      }
    }

    &__thumb {
      width: 115px;
      height: 70px;
      border-radius: 12px;
      flex-shrink: 0;
      border: 1px solid var(--landing-border-strong);
      object-fit: cover;
    }
  }

  @media (max-width: 991px) {
    .news-row-v2 {
      margin-top: 48px;

      &__track {
        gap: 10px;
      }

      &__card {
        width: 240px;
        padding: 8px;
        gap: 10px;
        border-radius: 14px;

        p {
          font-size: 11px;
        }
      }

      &__thumb {
        width: 72px;
        height: 48px;
        border-radius: 8px;
      }
    }
  }
</style>
