<template>
  <section class="faq-v2">
    <UiContainer>
      <h2>{{ t("landing.sections.faqs__title") }}</h2>
      <div class="layout">
        <div class="left">
          <TheFaqAccordion :items="displayedFaqData" />
          <p
            v-if="showHelpLink"
            class="help">
            {{ t("landing.sections.helpSection") }}
            <NuxtLink :to="localePath('/help')">
              {{ t("landing.sections.helpLinkText") }}
            </NuxtLink>
          </p>
        </div>

        <form
          class="form"
          @submit.prevent="handleSubmit">
          <div class="form__header">
            <h3>{{ t("landing.sections.faqs__form_title") }}</h3>
            <p>{{ t("landing.sections.faqs__form_subtitle") }}</p>
          </div>

          <input
            v-model="formData.name"
            class="form__input"
            type="text"
            :placeholder="t('landing.sections.faqs__form_placeholders.name')"
            autocomplete="name"
            required />

          <input
            v-model="formData.email"
            class="form__input"
            type="email"
            :placeholder="t('landing.sections.faqs__form_placeholders.email')"
            autocomplete="email"
            required />

          <textarea
            v-model="formData.description"
            class="form__textarea"
            :placeholder="t('landing.sections.faqs__form_placeholders.description')"
            required />

          <div
            class="form__dropzone"
            :class="{ 'form__dropzone--hover': isDragging }"
            role="button"
            tabindex="0"
            :aria-label="t('landing.sections.faqs__dropzone_aria')"
            @click="triggerFileInput"
            @keydown.enter.space.prevent="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop">
            <span>{{ t("landing.sections.faqs__dropzone_text") }}</span>
            <input
              ref="fileInputRef"
              type="file"
              class="form__file-input"
              multiple
              accept="image/png,image/jpeg,application/pdf"
              @change="onFileSelect" />
          </div>

          <div
            v-if="selectedFilesLabel"
            class="form__files">
            {{ selectedFilesLabel }}
          </div>

          <p
            v-if="formState.message"
            class="form__status"
            :class="`form__status--${formState.type}`">
            {{ formState.message }}
          </p>

          <button
            class="form__btn"
            type="submit"
            :disabled="formState.isSubmitting">
            {{ formState.isSubmitting ? submitLoadingText : t("landing.sections.faqs__form_button") }}
          </button>
        </form>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import { useRuntimeConfig } from "nuxt/app";
  import { useI18n } from "vue-i18n";
  import { useRoute } from "vue-router";
  import { useLocalePath } from "~/.nuxt/imports";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import TheFaqAccordion from "~/components/block/TheFaqAccordion.vue";

  type FaqAccordionItem = {
    title: string;
    description: string;
    isActive: boolean;
  };

  type PublicFaqItem = {
    question?: string;
    answer?: string;
  };

  const props = withDefaults(
    defineProps<{
      limit?: number;
      showHelpLink?: boolean;
    }>(),
    {
      limit: 5,
      showHelpLink: true,
    }
  );

  const { t, tm, locale } = useI18n();
  const config = useRuntimeConfig();
  const route = useRoute();
  const localePath = useLocalePath();

  const faqData = ref<FaqAccordionItem[]>([]);
  const apiFaqData = ref<FaqAccordionItem[]>([]);
  const submitLoadingText = "Sending...";

  const formData = ref({ name: "", email: "", description: "", files: [] as File[] });
  const formState = ref({
    isSubmitting: false,
    type: "idle" as "idle" | "success" | "error",
    message: "",
  });
  const isDragging = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const showHelpLink = computed(() => props.showHelpLink);
  const allFaqData = computed(() => (apiFaqData.value.length > 0 ? apiFaqData.value : faqData.value));
  const displayedFaqData = computed(() => {
    const items = allFaqData.value;
    return props.limit && props.limit > 0 ? items.slice(0, props.limit) : items;
  });
  const selectedFilesLabel = computed(() => {
    const files = formData.value.files;
    if (files.length === 0) return "";
    if (files.length === 1) return files[0].name;

    return `${files.length} files selected`;
  });

  const apiUrl = (path: string) => {
    const base = String(config.public.apiBase || "https://server.esterholdings.com/api").replace(/\/+$/, "");
    return `${base}/${path.replace(/^\/+/, "")}`;
  };

  const buildFallbackFaqData = (): FaqAccordionItem[] => {
    const raw = tm("landing.sections.faqs__items") as any[];
    if (!Array.isArray(raw)) return [];

    const activeIndex = raw.length > 1 ? 1 : 0;
    return raw.map((_, index) => ({
      title: t(`landing.sections.faqs__items[${index}].title`),
      description: t(`landing.sections.faqs__items[${index}].description`),
      isActive: index === activeIndex,
    }));
  };

  const normalizePublicFaqItems = (items: PublicFaqItem[]): FaqAccordionItem[] => {
    const activeIndex = items.length > 1 ? 1 : 0;

    return items
      .map((item, index) => ({
        title: String(item?.question ?? "").trim(),
        description: String(item?.answer ?? "").trim(),
        isActive: index === activeIndex,
      }))
      .filter(item => item.title !== "" && item.description !== "");
  };

  const loadFaqData = async () => {
    faqData.value = buildFallbackFaqData();

    try {
      const response = await $fetch<{ data?: PublicFaqItem[] } | PublicFaqItem[]>(apiUrl("/public/faqs"), {
        query: {
          locale: locale.value,
          limit: props.limit && props.limit > 0 ? props.limit : undefined,
        },
        headers: {
          "X-Locale": locale.value,
          "Accept-Language": locale.value,
        },
      });

      const responseItems = Array.isArray(response) ? response : response?.data;
      const serverItems = Array.isArray(responseItems) ? normalizePublicFaqItems(responseItems) : [];
      apiFaqData.value = serverItems;
    } catch {
      apiFaqData.value = [];
    }
  };

  const triggerFileInput = () => fileInputRef.value?.click();

  const onFileSelect = (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    formData.value.files = files;
  };

  const onDrop = (e: DragEvent) => {
    isDragging.value = false;
    formData.value.files = Array.from(e.dataTransfer?.files ?? []);
  };

  const resetForm = () => {
    formData.value = { name: "", email: "", description: "", files: [] };
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  };

  const handleSubmit = async () => {
    if (formState.value.isSubmitting) return;

    formState.value = { isSubmitting: true, type: "idle", message: "" };

    const payload = new FormData();
    payload.append("name", formData.value.name.trim());
    payload.append("email", formData.value.email.trim());
    payload.append("message", formData.value.description.trim());
    payload.append("locale", locale.value);
    if (typeof window !== "undefined") {
      payload.append("page_url", window.location.href);
    } else {
      payload.append("page_url", route.fullPath);
    }
    formData.value.files.forEach(file => payload.append("files[]", file));

    try {
      await $fetch(apiUrl("/public/support/tickets"), {
        method: "POST",
        body: payload,
        headers: {
          "X-Locale": locale.value,
          "Accept-Language": locale.value,
        },
      });

      resetForm();
      formState.value = {
        isSubmitting: false,
        type: "success",
        message: "Your request has been sent. We will reply by email.",
      };
    } catch {
      formState.value = {
        isSubmitting: false,
        type: "error",
        message: "Unable to send your request. Please try again.",
      };
    }
  };

  watch(locale, () => {
    loadFaqData();
  });

  onMounted(() => {
    loadFaqData();
  });
</script>

<style lang="scss" scoped>
  .faq-v2 {
    margin-top: 160px;
    margin-bottom: 94px;

    h2 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 42px;
      line-height: 1.302;
      font-weight: 500;
    }
  }

  .layout {
    margin-top: 34px;
    display: grid;
    grid-template-columns: 1fr 555px;
    gap: 20px;
    align-items: start;
  }

  .left {
    padding-top: 0;
  }

  .help {
    margin: 30px 0 0;
    color: var(--landing-text-primary);
    font-size: 16px;
    line-height: 1.302;
    font-weight: 700;

    a {
      font-weight: 700;
      color: var(--landing-accent-secondary);
      text-decoration: underline;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  /* Override TheFaqAccordion styles for Figma parity */
  :deep(.faq-item) {
    max-width: none !important;
  }

  :deep(.faq-title) {
    color: var(--landing-accent) !important;
    font-size: 22px !important;
    font-weight: 700 !important;
  }

  :deep(.faq-answer) {
    padding: 0 0 30px !important;
  }

  :deep(.faq-answer p) {
    color: var(--landing-text-secondary) !important;
    font-size: 16px !important;
    font-weight: 400 !important;
  }

  :deep(.faq-divider) {
    background: var(--landing-line) !important;
    margin: 0 !important;
  }

  :deep(.faq-question) {
    padding: 30px 0 !important;
    gap: 12px;
  }

  /* ---- Form card ---- */
  .form {
    background: var(--landing-surface-glass);
    border-radius: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 630px;

    box-shadow: var(--landing-shadow-glass);
    border: 1px solid var(--landing-border-strong);

    &__header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    h3 {
      margin: 0;
      color: var(--landing-accent-secondary);
      font-size: 42px;
      line-height: 1.302;
      font-weight: 400;
    }

    p {
      margin: 0;
      color: var(--landing-text-muted);
      font-size: 18px;
      line-height: 1.302;
      font-weight: 700;
    }

    &__input {
      width: 100%;
      border: 1px solid var(--landing-border);
      border-radius: 12px;
      padding: 16px;
      font-size: 16px;
      color: var(--landing-text-strong);
      background: transparent;
      outline: none;
      transition: border-color 0.2s;

      &::placeholder {
        color: var(--landing-text-tertiary);
        font-weight: 400;
      }

      &:focus {
        border-color: var(--landing-accent);
      }

      &:hover:not(:focus) {
        border-color: var(--landing-text-secondary);
      }
    }

    &__textarea {
      flex: 1 0 0;
      width: 100%;
      min-height: 100px;
      border: 1px solid var(--landing-border);
      border-radius: 12px;
      padding: 16px;
      font-size: 16px;
      color: var(--landing-text-strong);
      background: transparent;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      font-family: inherit;

      &::placeholder {
        color: var(--landing-text-tertiary);
        font-weight: 400;
      }

      &:focus {
        border-color: var(--landing-accent);
      }

      &:hover:not(:focus) {
        border-color: var(--landing-text-secondary);
      }
    }

    &__dropzone {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed var(--landing-accent);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition:
        background 0.2s,
        border-color 0.2s;
      text-align: center;

      &:hover,
      &--hover {
        background: color-mix(in srgb, var(--landing-accent) 8%, transparent);
      }

      span {
        color: var(--landing-text-tertiary);
        font-size: 16px;
        line-height: 1.302;
        pointer-events: none;
      }
    }

    &__file-input {
      display: none;
    }

    &__files {
      color: var(--landing-text-secondary);
      font-size: 14px;
      line-height: 1.302;
    }

    &__status {
      margin: -4px 0 0;
      font-size: 14px;
      line-height: 1.4;
      font-weight: 600;

      &--success {
        color: var(--landing-accent);
      }

      &--error {
        color: var(--landing-accent-secondary);
      }
    }

    &__btn {
      width: 170px;
      height: 53px;
      background: var(--landing-accent);
      color: var(--landing-on-accent);
      font-size: 16px;
      font-weight: 700;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition:
        background 0.2s,
        opacity 0.2s;
      font-family: inherit;

      &:hover {
        background: var(--landing-accent-hover);
      }

      &:active {
        opacity: 0.85;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    }
  }

  @media (max-width: 1200px) {
    .layout {
      grid-template-columns: 1fr 460px;
    }
  }

  @media (max-width: 991px) {
    .faq-v2 {
      margin-top: 56px;
      margin-bottom: 56px;

      h2 {
        font-size: 34px;
      }
    }

    .layout {
      grid-template-columns: 1fr;
    }

    .left {
      padding-top: 0;
    }

    .form {
      min-height: auto;
      padding: 24px;

      h3 {
        font-size: 34px;
      }

      &__btn {
        width: 100%;
      }
    }
  }

  @media (max-width: 480px) {
    .form {
      padding: 20px;
      gap: 14px;
    }
  }
</style>
