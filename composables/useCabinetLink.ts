import { computed } from "vue";
import { useRuntimeConfig } from "nuxt/app";
import { useI18n } from "vue-i18n";

const DEFAULT_CABINET_URL = "https://my.esterholdings.space";

const normalizeBaseUrl = (value: unknown): string => {
  const candidate = String(value || "").trim();
  return (candidate || DEFAULT_CABINET_URL).replace(/\/+$/, "");
};

const normalizePath = (value: string): string => {
  const path = `/${String(value || "/").replace(/^\/+/, "")}`;
  return path === "/dashboard" ? "/" : path;
};

export const useCabinetLink = () => {
  const runtimeConfig = useRuntimeConfig();
  const { locale } = useI18n();

  const cabinetBaseUrl = computed(() => normalizeBaseUrl(runtimeConfig.public?.cabinetUrl));

  const cabinetLink = (path = "/"): string => {
    const normalizedPath = normalizePath(path);
    const localePrefix = locale.value ? `/${String(locale.value).toLowerCase()}` : "";

    return `${cabinetBaseUrl.value}${localePrefix}${normalizedPath === "/" ? "" : normalizedPath}`;
  };

  return {
    cabinetBaseUrl,
    cabinetLink,
  };
};

export default useCabinetLink;
