<template>
  <a
    :href="link"
    class="news-card"
    @click="handleNavigation">
    <div class="news-card__image-wrap">
      <img
        class="news-card__image"
        :class="{ 'news-card__image--loaded': isImageLoaded }"
        :src="currentImage"
        :alt="title"
        @load="handleImageLoad"
        @error="handleImageError" />
    </div>

    <div class="news-card__body">
      <h2 class="news-card__title">{{ title }}</h2>
      <p class="news-card__message">{{ message }}</p>

      <div class="news-card__meta">
        <time class="news-card__date">{{ date }}</time>
        <span class="news-card__link">{{ buttonText }}</span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { navigateTo } from "#app";

  const emit = defineEmits<{
    select: [];
  }>();

  const fallbackImage = "/static/newsBg.jpg";
  const props = defineProps({
    title: String,
    date: String,
    message: String,
    link: String,
    buttonText: String,
    image: String,
  });

  const currentImage = ref(props.image || fallbackImage);
  const isImageLoaded = ref(false);

  watch(
    () => props.image,
    value => {
      currentImage.value = value || fallbackImage;
      isImageLoaded.value = false;
    }
  );

  function handleImageLoad(): void {
    isImageLoaded.value = true;
  }

  function handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src.includes(fallbackImage)) return;

    currentImage.value = fallbackImage;
    isImageLoaded.value = false;
  }

  function handleNavigation(event: MouseEvent): void {
    emit("select");

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    void navigateTo(props.link || "/");
  }
</script>

<style scoped lang="scss">
  .news-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--landing-border-strong);
    border-radius: 10px;
    color: inherit;
    text-decoration: none;
    background: var(--landing-surface);
    box-shadow: var(--landing-shadow-glass), var(--landing-shadow-card);
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--landing-accent) 32%, var(--landing-border-strong));
      box-shadow:
        var(--landing-shadow-glass),
        0 18px 44px color-mix(in srgb, var(--landing-accent) 14%, transparent);
    }

    &__image-wrap {
      width: 100%;
      aspect-ratio: 1.63 / 1;
      overflow: hidden;
      background:
        linear-gradient(
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent),
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent)
        ),
        url("/static/newsBg.jpg") center / cover;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition:
        opacity 0.24s ease,
        transform 0.32s ease;

      &--loaded {
        opacity: 1;
      }
    }

    &:hover &__image {
      transform: scale(1.025);
    }

    &__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 184px;
      padding: 24px 24px 22px;
    }

    &__date {
      margin: 0;
      display: block;
      color: var(--landing-text-secondary);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.2;
    }

    &__title {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.12;
    }

    &__message {
      margin: 16px 0 0;
      display: -webkit-box;
      overflow: hidden;
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.26;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    &__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      margin-top: auto;
      padding-top: 24px;
    }

    &__link {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--landing-accent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }
  }

  @media (max-width: 575px) {
    .news-card {
      &__body {
        min-height: 170px;
        padding: 20px;
      }

      &__meta {
        padding-top: 20px;
      }
    }
  }
</style>
