<template>
  <main class="article-detail">
    <UiContainer>
      <article
        v-if="article"
        class="article-detail__article">
        <header class="article-detail__header">
          <h1>{{ article.title }}</h1>
          <p v-if="article.subtitle">{{ article.subtitle }}</p>
        </header>

        <div
          v-if="article.image"
          class="article-detail__cover">
          <img
            class="article-detail__cover-image"
            :class="{ 'article-detail__cover-image--loaded': isCoverLoaded }"
            :src="currentCoverImage"
            :alt="article.title"
            @load="handleImageLoad"
            @error="handleImageError" />
        </div>

        <div
          v-if="renderedContent"
          class="article-detail__content"
          v-html="renderedContent"></div>
      </article>

      <section
        v-else-if="loading"
        class="article-detail__skeleton"
        aria-busy="true"
        aria-label="Loading article">
        <div class="article-detail__skeleton-title"></div>
        <div class="article-detail__skeleton-subtitle"></div>
        <div class="article-detail__skeleton-cover"></div>
        <div class="article-detail__skeleton-line article-detail__skeleton-line--wide"></div>
        <div class="article-detail__skeleton-line"></div>
        <div class="article-detail__skeleton-line article-detail__skeleton-line--short"></div>
      </section>

      <section
        v-else
        class="article-detail__not-found">
        <h1>{{ notFoundTitle }}</h1>
        <p>{{ notFoundText }}</p>
      </section>
    </UiContainer>
  </main>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useHead } from "#app";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import type { NewsItem } from "~/composables/core/modules/news/news.types";

  const fallbackImage = "/static/newsBg.jpg";

  useHead({
    bodyAttrs: {
      class: "landing-article-detail-route",
    },
  });

  const props = withDefaults(
    defineProps<{
      article: NewsItem | null;
      renderedContent?: string;
      loading?: boolean;
      notFoundTitle?: string;
      notFoundText?: string;
    }>(),
    {
      renderedContent: "",
      loading: false,
      notFoundTitle: "Article not found",
      notFoundText: "The requested article is not available.",
    }
  );

  const currentCoverImage = ref(fallbackImage);
  const isCoverLoaded = ref(false);

  watch(
    () => props.article?.image,
    value => {
      currentCoverImage.value = value || fallbackImage;
      isCoverLoaded.value = false;
    },
    { immediate: true }
  );

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
  :global(body.landing-article-detail-route .page-content),
  :global(body.landing-article-detail-route .page--inner) {
    background-color: var(--landing-bg);
  }

  .article-detail {
    position: relative;
    z-index: 0;
    padding: 54px 0 104px;
    background: var(--landing-bg);
    font-family: "DM Sans", "Inter", "Muli", sans-serif;

    &__article,
    &__skeleton,
    &__not-found {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }

    &__skeleton {
      min-height: 760px;
    }

    &__skeleton-title,
    &__skeleton-subtitle,
    &__skeleton-cover,
    &__skeleton-line {
      border-radius: 10px;
      background: linear-gradient(
        100deg,
        var(--landing-surface-muted) 20%,
        var(--landing-surface) 42%,
        var(--landing-surface-muted) 64%
      );
      background-size: 220% 100%;
      animation: article-detail-skeleton 1.25s ease-in-out infinite;
    }

    &__skeleton-title {
      width: 78%;
      height: 80px;
    }

    &__skeleton-subtitle {
      width: 56%;
      height: 20px;
      margin-top: 34px;
    }

    &__skeleton-cover {
      width: 100%;
      aspect-ratio: 900 / 600;
      margin-top: 38px;
      border-radius: 14px;
    }

    &__skeleton-line {
      width: 76%;
      height: 16px;
      margin-top: 18px;

      &--wide {
        width: 100%;
        margin-top: 54px;
      }

      &--short {
        width: 48%;
      }
    }

    &__header {
      margin-bottom: 38px;

      h1 {
        max-width: 900px;
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 82px;
        font-weight: 400;
        line-height: 80px;
        letter-spacing: 0;
        overflow-wrap: anywhere;
      }

      p {
        max-width: 900px;
        margin: 34px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 400;
        line-height: 1.3;
      }
    }

    &__cover {
      width: 100%;
      aspect-ratio: 900 / 600;
      overflow: hidden;
      border-radius: 14px;
      background:
        linear-gradient(
          color-mix(in srgb, var(--landing-surface-muted) 84%, transparent),
          color-mix(in srgb, var(--landing-surface-muted) 84%, transparent)
        ),
        url("/static/newsBg.jpg") center / cover;
    }

    &__cover-image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.24s ease;

      &--loaded {
        opacity: 1;
      }
    }

    &__content {
      width: 100%;
      margin-top: 54px;
      color: var(--landing-text-primary);
      font-size: 16px;
      line-height: 1.42;
      overflow-wrap: anywhere;

      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4) {
        margin: 44px 0 22px;
        color: var(--landing-text-primary);
        font-weight: 500;
        line-height: 1;
        letter-spacing: 0;
      }

      :deep(h1:first-child),
      :deep(h2:first-child),
      :deep(h3:first-child),
      :deep(h4:first-child) {
        margin-top: 0;
      }

      :deep(h1),
      :deep(h2) {
        font-size: 40px;
      }

      :deep(h3) {
        font-size: 32px;
      }

      :deep(h4) {
        font-size: 24px;
      }

      :deep(p) {
        margin: 0 0 18px;
        color: var(--landing-text-secondary);
        font-size: 16px;
        font-weight: 400;
        line-height: 1.35;
      }

      :deep(ul),
      :deep(ol) {
        margin: 0 0 18px;
        padding-left: 22px;
        color: var(--landing-text-secondary);
        font-size: 16px;
        line-height: 1.35;
      }

      :deep(li + li) {
        margin-top: 4px;
      }

      :deep(strong),
      :deep(b) {
        color: var(--landing-text-primary);
        font-weight: 700;
      }

      :deep(a) {
        color: var(--landing-accent);
        text-decoration: none;
      }

      :deep(p > a:only-child),
      :deep(a.btn),
      :deep(.btn) {
        min-width: 340px;
        min-height: 66px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
        margin-top: 24px;
        padding: 0 24px;
        border: 0;
        border-radius: 14px;
        color: var(--landing-on-accent);
        background: var(--landing-accent);
        font-size: 18px;
        font-weight: 800;
        line-height: 1;
        text-decoration: none;
        transition:
          background-color 0.2s ease,
          transform 0.2s ease;

        &::after {
          content: "→";
          font-size: 28px;
          font-weight: 400;
          line-height: 1;
        }

        &:hover {
          background: var(--landing-accent-hover);
          transform: translateY(-1px);
        }
      }

      :deep(img) {
        display: block;
        width: 100%;
        max-width: 100%;
        height: auto;
        margin: 32px 0;
        border-radius: 14px;
      }

      :deep(hr) {
        margin: 34px 0;
        border: 0;
        border-top: 1px solid var(--landing-border-strong);
      }

      :deep(.table-responsive) {
        width: 100%;
        overflow-x: auto;
        margin: 28px 0;
      }

      :deep(table) {
        width: 100%;
        min-width: 720px;
        overflow: hidden;
        border: 1px solid var(--landing-border-strong);
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 10px;
        background: var(--landing-surface);
      }

      :deep(th),
      :deep(td) {
        padding: 14px 16px;
        border-right: 1px solid var(--landing-border-strong);
        border-bottom: 1px solid var(--landing-border-strong);
        color: var(--landing-text-primary);
        font-size: 14px;
        line-height: 1.35;
        vertical-align: middle;
      }

      :deep(th:last-child),
      :deep(td:last-child) {
        border-right: 0;
      }

      :deep(tr:last-child td),
      :deep(tr:last-child th) {
        border-bottom: 0;
      }

      :deep(td img) {
        width: auto;
        max-width: 72px;
        margin: 0 auto;
        border-radius: 0;
      }

      :deep(td a.btn),
      :deep(td .btn) {
        min-width: 0;
        min-height: 36px;
        margin-top: 0;
        padding: 0 14px;
        border-radius: 8px;
        font-size: 12px;

        &::after {
          display: none;
        }
      }

      :deep(.su-tabs) {
        margin: 20px 0 30px;
      }

      :deep(.su-tabs-nav) {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 18px;
      }

      :deep(.su-tabs-nav span) {
        display: inline-flex;
        align-items: center;
        min-height: 38px;
        padding: 0 16px;
        border: 1px solid var(--landing-border-strong);
        border-radius: 8px;
        color: var(--landing-text-primary);
        background: var(--landing-surface);
        font-size: 14px;
        font-weight: 700;
      }

      :deep(.su-tabs-pane + .su-tabs-pane) {
        margin-top: 26px;
      }
    }

    &__not-found {
      padding: 80px 0;
      text-align: center;

      h1 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 56px;
        font-weight: 400;
        line-height: 1;
      }

      p {
        margin: 20px 0 0;
        color: var(--landing-text-secondary);
        font-size: 16px;
        line-height: 1.4;
      }
    }
  }

  @keyframes article-detail-skeleton {
    from {
      background-position: 100% 0;
    }

    to {
      background-position: -120% 0;
    }
  }

  @media (max-width: 991px) {
    .article-detail {
      padding: 36px 0 72px;

      &__header {
        h1 {
          font-size: 60px;
          line-height: 58px;
        }
      }

      &__skeleton-title {
        height: 58px;
      }

      &__content {
        :deep(h1),
        :deep(h2) {
          font-size: 34px;
        }
      }
    }
  }

  @media (max-width: 640px) {
    .article-detail {
      padding: 26px 0 56px;

      &__header {
        margin-bottom: 28px;

        h1 {
          font-size: 42px;
          line-height: 42px;
        }

        p {
          margin-top: 22px;
          font-size: 14px;
        }
      }

      &__cover {
        aspect-ratio: 4 / 3;
        border-radius: 10px;
      }

      &__skeleton {
        min-height: 580px;
      }

      &__skeleton-title {
        width: 88%;
        height: 42px;
      }

      &__skeleton-subtitle {
        width: 72%;
        height: 16px;
        margin-top: 22px;
      }

      &__skeleton-cover {
        aspect-ratio: 4 / 3;
        margin-top: 28px;
        border-radius: 10px;
      }

      &__skeleton-line--wide {
        margin-top: 36px;
      }

      &__content {
        margin-top: 36px;

        :deep(h1),
        :deep(h2) {
          font-size: 30px;
        }

        :deep(h3) {
          font-size: 24px;
        }

        :deep(p),
        :deep(ul),
        :deep(ol) {
          font-size: 14px;
        }

        :deep(p > a:only-child),
        :deep(a.btn),
        :deep(.btn) {
          width: 100%;
          min-width: 0;
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .article-detail__skeleton-title,
    .article-detail__skeleton-subtitle,
    .article-detail__skeleton-cover,
    .article-detail__skeleton-line {
      animation: none;
    }
  }
</style>
