<template>
  <main class="news-detail">
    <UiContainer>
      <article class="news-detail__article">
        <NuxtLink
          :to="localizedPath('/company-news')"
          class="news-detail__back">
          ← {{ t("landing.pages.company.news.back", "Company news") }}
        </NuxtLink>

        <header class="news-detail__header">
          <time
            v-if="article.publishedAt"
            class="news-detail__date">
            {{ article.publishedAt }}
          </time>
          <h1>{{ article.title }}</h1>
          <p v-if="article.subtitle">{{ article.subtitle }}</p>
        </header>

        <div
          v-if="article.image"
          class="news-detail__cover">
          <img
            class="news-detail__cover-image"
            :class="{ 'news-detail__cover-image--loaded': isCoverLoaded }"
            :src="currentCoverImage"
            :alt="article.title"
            @load="handleImageLoad"
            @error="handleImageError" />
        </div>

        <div
          class="news-detail__content"
          v-html="renderedContent"></div>
      </article>
    </UiContainer>
  </main>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { createError, useAsyncData, useRoute, useSeoMeta } from "#app";
  import { definePageMeta } from "~/.nuxt/imports";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import useAppCore from "~/composables/useAppCore";

  definePageMeta({
    layout: "main",
  });

  const route = useRoute();
  const { t, locale } = useI18n();
  const appCore = useAppCore();
  const slug = computed(() => String(route.params.slug || ""));

  const { data: articleData } = await useAsyncData(`news-detail-${slug.value}-${locale.value}`, async () => {
    const response = await appCore.news.getBySlug(slug.value, { locale: locale.value });
    return response.data.data;
  });

  if (!articleData.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "News article not found",
    });
  }

  const article = computed(() => articleData.value!);
  const renderedContent = computed(() => renderMarkdownLike(article.value.content || ""));
  const fallbackImage = "/static/newsBg.jpg";
  const currentCoverImage = ref(article.value.image || fallbackImage);
  const isCoverLoaded = ref(false);

  watch(
    () => article.value.image,
    value => {
      currentCoverImage.value = value || fallbackImage;
      isCoverLoaded.value = false;
    }
  );

  function localizedPath(path: string): string {
    return locale.value ? `/${locale.value}${path}` : path;
  }

  useSeoMeta({
    title: computed(() => article.value.seo.meta_title || article.value.title),
    description: computed(() => article.value.seo.meta_description || article.value.subtitle || ""),
    ogTitle: computed(() => article.value.seo.og_title || article.value.title),
    ogDescription: computed(() => article.value.seo.og_description || article.value.subtitle || ""),
    ogImage: computed(() => article.value.seo.og_image_url || article.value.image),
    twitterTitle: computed(() => article.value.seo.twitter_title || article.value.title),
    twitterDescription: computed(() => article.value.seo.twitter_description || article.value.subtitle || ""),
    twitterImage: computed(() => article.value.seo.twitter_image_url || article.value.image),
  });

  function renderMarkdownLike(value: string): string {
    const blocks = escapeHtml(value)
      .split(/\n{2,}/)
      .map(block => block.trim())
      .filter(Boolean);

    return blocks
      .map(block => {
        const lines = block.split("\n").map(line => line.trim());
        const firstLine = lines[0] || "";

        if (firstLine.startsWith("### ")) {
          return `<h3>${firstLine.slice(4)}</h3>`;
        }

        if (firstLine.startsWith("## ")) {
          return `<h2>${firstLine.slice(3)}</h2>`;
        }

        if (lines.every(line => line.startsWith("- "))) {
          return `<ul>${lines.map(line => `<li>${line.slice(2)}</li>`).join("")}</ul>`;
        }

        return `<p>${lines.join("<br>")}</p>`;
      })
      .join("");
  }

  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function handleImageLoad(): void {
    isCoverLoaded.value = true;
  }

  function handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src.includes(fallbackImage)) return;

    currentCoverImage.value = fallbackImage;
    isCoverLoaded.value = false;
  }
</script>

<style scoped lang="scss">
  .news-detail {
    padding: 42px 0 80px;

    &__article {
      max-width: 920px;
      margin: 0 auto;
    }

    &__back {
      display: inline-flex;
      margin-bottom: 24px;
      color: var(--landing-accent);
      font-size: 14px;
      font-weight: 800;
      text-decoration: none;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: clamp(34px, 4vw, 58px);
        line-height: 1.06;
        font-weight: 800;
      }

      p {
        max-width: 760px;
        margin: 0;
        color: var(--landing-text-secondary);
        font-size: 18px;
        line-height: 1.58;
      }
    }

    &__date {
      color: var(--landing-text-secondary);
      font-size: 14px;
      font-weight: 800;
    }

    &__cover {
      width: 100%;
      aspect-ratio: 16 / 8.5;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid var(--landing-border-strong);
      background:
        linear-gradient(
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent),
          color-mix(in srgb, var(--landing-surface-muted) 88%, transparent)
        ),
        url("/static/newsBg.jpg") center / cover;
    }

    &__cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.24s ease;

      &--loaded {
        opacity: 1;
      }
    }

    &__content {
      margin-top: 32px;
      color: var(--landing-text-primary);
      font-size: 17px;
      line-height: 1.72;

      :deep(h2),
      :deep(h3) {
        margin: 30px 0 12px;
        color: var(--landing-text-primary);
        line-height: 1.22;
      }

      :deep(h2) {
        font-size: 28px;
      }

      :deep(h3) {
        font-size: 22px;
      }

      :deep(p) {
        margin: 0 0 18px;
        color: var(--landing-text-secondary);
      }

      :deep(ul) {
        margin: 0 0 18px;
        padding-left: 22px;
        color: var(--landing-text-secondary);
      }
    }
  }

  @media (max-width: 640px) {
    .news-detail {
      padding: 28px 0 56px;

      &__cover {
        aspect-ratio: 4 / 3;
      }
    }
  }
</style>
