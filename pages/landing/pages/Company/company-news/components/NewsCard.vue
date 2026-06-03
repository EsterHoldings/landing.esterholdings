<template>
  <NuxtLink
    :to="link"
    class="news-card">
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
      <UiTextParagraph class="news-card__date">{{ date }}</UiTextParagraph>
      <UiTextH4 class="news-card__title">{{ title }}</UiTextH4>
      <UiTextParagraph class="news-card__message">{{ message }}</UiTextParagraph>

      <span class="news-card__link">{{ buttonText }}<span>→</span></span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import UiTextH4 from "~/components/ui/UiTextH4.vue";
  import UiTextParagraph from "~/components/ui/UiTextParagraph.vue";

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
</script>

<style scoped lang="scss">
  .news-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--landing-border-strong);
    border-radius: 8px;
    color: inherit;
    text-decoration: none;
    background: var(--landing-surface-glass);
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--landing-accent) 44%, var(--landing-border-strong));
      box-shadow: 0 18px 40px color-mix(in srgb, var(--landing-accent) 12%, transparent);
    }

    &__image-wrap {
      width: 100%;
      aspect-ratio: 16 / 9;
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
      transition: opacity 0.24s ease;

      &--loaded {
        opacity: 1;
      }
    }

    &__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }

    &__date {
      margin: 0;
      color: var(--landing-text-secondary);
      font-size: 13px;
      font-weight: 700;
    }

    &__title {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 20px;
      line-height: 1.24;
    }

    &__message {
      margin: 0;
      display: -webkit-box;
      overflow: hidden;
      color: var(--landing-text-secondary);
      font-size: 14px;
      line-height: 1.5;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    &__link {
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--landing-accent);
      font-size: 14px;
      font-weight: 800;
    }
  }
</style>
