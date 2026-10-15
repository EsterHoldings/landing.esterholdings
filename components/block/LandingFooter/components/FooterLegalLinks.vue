<template>
  <ul class="footer-list">
    <li>
      <UiTextH5>{{ t("landing.footer.legal_documents.title") }}</UiTextH5>
    </li>
    <li
      v-for="link in legalLinks"
      :key="link.path"
      class="item">
      <a
        :href="legalDocumentUrl(link.path)"
        target="_blank"
        rel="noopener noreferrer">
        <UiTextH6>{{ t(link.labelKey) }}</UiTextH6>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { useI18n } from "vue-i18n";
  import UiTextH5 from "~/components/ui/UiTextH5.vue";
  import UiTextH6 from "~/components/ui/UiTextH6.vue";

  const { t, locale } = useI18n();
  const config = useRuntimeConfig();
  const legalLinks = [
    { labelKey: "landing.footer.legal_documents.risks", path: "risks/details" },
    { labelKey: "landing.footer.legal_documents.offer", path: "offert/details" },
    { labelKey: "landing.footer.legal_documents.privacy", path: "persondata/details" },
  ];

  const legalDocumentUrl = (path: string): string => {
    const baseUrl = String(config.public.legalDocsBaseUrl || "https://my.esterholdings.com").replace(
      /\/+$/,
      ""
    );
    return `${baseUrl}/${locale.value}/${path}`;
  };
</script>

<style lang="scss" scoped>
  .footer-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    list-style: none;

    h5 {
      color: var(--landing-text-primary);
    }
  }

  .item {
    color: var(--landing-text-secondary);

    a {
      color: inherit;
    }
  }

  @media (max-width: 767px) {
    .footer-list {
      width: 100%;
      align-items: flex-start;
    }
  }
</style>
