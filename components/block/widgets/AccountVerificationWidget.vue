<template>
  <div class="verification-widget dashboard-side-widget text-[var(--ui-text-main)]">
    <div class="verification-hero">
      <div class="verification-hero__titles">
        <div class="verification-hero__title">
          {{ t("cabinet.dashboard.accountVerification.title") }}
        </div>
        <div class="verification-hero__subtitle">
          {{ t("cabinet.dashboard.accountVerification.subtitle") }}
        </div>
      </div>

      <NuxtLink :to="profileLink" class="verification-profile">
        <div class="verification-profile__meta">
          <div class="verification-profile__name" :title="displayName">
            {{ displayName }}
          </div>
          <div class="verification-profile__email" :title="displayEmail">
            {{ displayEmail }}
          </div>
        </div>
        <UiImageCircle :twoChars="initials" :src="photoUrl" />
      </NuxtLink>
    </div>

    <div class="verification-list-wrap">
      <div v-if="isLoading" class="verification-list">
        <div v-for="idx in 5" :key="idx" class="verification-item verification-item--skeleton animate-pulse">
          <div class="verification-item__row">
            <div class="h-8 w-8 rounded-lg bg-[var(--color-stroke-ui-light)]"></div>
            <div class="flex-1 min-w-0 space-y-2">
              <div class="h-3 w-28 rounded bg-[var(--color-stroke-ui-light)]"></div>
              <div class="h-3 w-44 rounded bg-[var(--color-stroke-ui-light)]"></div>
            </div>
            <div class="h-5 w-20 rounded bg-[var(--color-stroke-ui-light)]"></div>
          </div>
        </div>
      </div>

      <div v-else class="verification-list">
        <div v-for="item in verificationSteps" :key="item.key" class="verification-item">
          <div class="verification-item__row">
            <div class="step-icon" :class="item.state">
              <component :is="item.icon" class="h-4 w-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="verification-item__head">
                <span class="verification-item__title" :title="item.title">
                  {{ item.title }}
                </span>
                <UiBadge :state="badgeState(item.state)" outline class="verification-item__badge !py-0.5 !px-2 text-xs">
                  {{ item.statusLabel }}
                </UiBadge>
              </div>

              <div class="verification-text-row">
                <span
                  :ref="(el) => setLineRef(lineKey(item.key, 'status'), el as HTMLElement | null)"
                  class="verification-text-line text-[var(--ui-text-secondary)]"
                  :class="{ 'is-expanded': isExpanded(lineKey(item.key, 'status')) }"
                  :title="!isExpanded(lineKey(item.key, 'status')) ? item.statusText : undefined">
                  {{ item.statusText }}
                </span>
                <UiIconArrowDown
                  v-if="showArrow(lineKey(item.key, 'status'))"
                  class="verification-expand-icon ml-4"
                  @click="expandLine(lineKey(item.key, 'status'))" />
              </div>

              <div v-if="item.comment" class="verification-text-row mt-1">
                <span
                  :ref="(el) => setLineRef(lineKey(item.key, 'comment'), el as HTMLElement | null)"
                  class="verification-text-line is-accent"
                  :class="{ 'is-expanded': isExpanded(lineKey(item.key, 'comment')) }"
                  :title="!isExpanded(lineKey(item.key, 'comment')) ? item.comment : undefined">
                  {{ item.comment }}
                </span>
                <UiIconArrowDown
                  v-if="showArrow(lineKey(item.key, 'comment'))"
                  class="verification-expand-icon ml-4"
                  @click="expandLine(lineKey(item.key, 'comment'))" />
              </div>

              <div v-if="item.hint" class="verification-text-row mt-1">
                <span
                  :ref="(el) => setLineRef(lineKey(item.key, 'hint'), el as HTMLElement | null)"
                  class="verification-text-line text-[var(--ui-text-secondary)]"
                  :class="{ 'is-expanded': isExpanded(lineKey(item.key, 'hint')) }"
                  :title="!isExpanded(lineKey(item.key, 'hint')) ? item.hint : undefined">
                  {{ item.hint }}
                </span>
                <UiIconArrowDown
                  v-if="showArrow(lineKey(item.key, 'hint'))"
                  class="verification-expand-icon ml-4"
                  @click="expandLine(lineKey(item.key, 'hint'))" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useLocalePath } from "~/.nuxt/imports";

import UiImageCircle from "~/components/ui/UiImageCircle.vue";
import UiBadge from "~/components/ui/UiBadge.vue";
import UiIconSuccess from "~/components/ui/UiIconSuccess.vue";
import UiIconFailed from "~/components/ui/UiIconFailed.vue";
import UiIconWarning from "~/components/ui/UiIconWarning.vue";
import UiIconArrowDown from "~/components/ui/UiIconArrowDown.vue";

import useAppCore from "~/composables/useAppCore";
import useEventBus from "~/composables/useEventBus";
import { useAuthStore } from "~/stores/authStore";

type VerificationStatus = "pending" | "approved" | "rejected";

const { t } = useI18n({ useScope: "global" });
const localePath = useLocalePath();
const appCore = useAppCore();
const authStore = useAuthStore();

const profileLink = computed(() => localePath("/profile"));

const displayName = computed(() => {
  const user = authStore.user;
  const first = user?.first_name || "";
  const last = user?.last_name || "";
  const full = `${first} ${last}`.trim();
  return full.length ? full : user?.email || "-";
});

const displayEmail = computed(() => authStore.user?.email || "-");
const photoUrl = computed(() => authStore.photoUrl || "");
const initials = computed(() => {
  const user = authStore.user;
  const first = user?.first_name?.[0] || "";
  const last = user?.last_name?.[0] || "";
  const value = `${first}${last}`.toUpperCase();
  return value.length ? value : "U";
});

const isLoading = ref(false);
const verificationRequestData = reactive<Record<string, any>>({});
const handleDashboardRefresh = () => loadVerificationData();
const expandedLines = reactive<Record<string, boolean>>({});
const overflowLines = reactive<Record<string, boolean>>({});
const lineRefs = ref<Record<string, HTMLElement | null>>({});

const emailStatus = ref<VerificationStatus>("pending");
const infoStatus = ref<VerificationStatus>("pending");
const photoStatus = ref<VerificationStatus>("pending");
const documentsStatus = ref<VerificationStatus>("pending");
const depositStatus = ref<VerificationStatus>("pending");

const emailComment = ref("");
const infoComment = ref("");
const photoComment = ref("");
const documentsComment = ref("");
const depositComment = ref("");

const statusState = (status: VerificationStatus) => {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  return "warn";
};

const statusLabel = (status: VerificationStatus) => {
  if (status === "approved") return t("cabinet.dashboard.accountVerification.statuses.done") || "Done";
  if (status === "rejected") return t("cabinet.dashboard.accountVerification.statuses.required") || "Required";
  return t("cabinet.dashboard.accountVerification.statuses.inProgress") || "In progress";
};

const statusTextByKey = (key: string, status: VerificationStatus) => {
  if (key === "photo") {
    if (status === "approved") return t("cabinet.dashboard.accountVerification.profilePhotoVerified");
    if (status === "rejected") return t("cabinet.dashboard.accountVerification.profilePhotoRejected");
    return t("cabinet.dashboard.accountVerification.profilePhotoInProgress");
  }

  if (key === "docs") {
    if (status === "approved") return t("cabinet.dashboard.accountVerification.documentVerified");
    if (status === "rejected") return t("cabinet.dashboard.accountVerification.documentRejected");
    return t("cabinet.dashboard.accountVerification.documentInProgress");
  }

  if (key === "deposit") {
    if (status === "approved") return t("cabinet.dashboard.accountVerification.paymentVerified");
    if (status === "rejected") return t("cabinet.dashboard.accountVerification.paymentRejected");
    return t("cabinet.dashboard.accountVerification.paymentInProgress");
  }

  if (key === "profile") {
    if (status === "approved") return t("cabinet.dashboard.accountVerification.profileVerified");
    if (status === "rejected") return t("cabinet.dashboard.accountVerification.profileRejected");
    return t("cabinet.dashboard.accountVerification.profileInProgress");
  }

  if (status === "approved") return t("cabinet.dashboard.accountVerification.profileVerified");
  if (status === "rejected") return t("cabinet.dashboard.accountVerification.profileRejected");
  return t("cabinet.dashboard.accountVerification.profileInProgress");
};

const verificationSteps = computed(() => [
  {
    key: "photo",
    title: "Фото користувача",
    status: photoStatus.value,
    statusText: statusTextByKey("photo", photoStatus.value),
    statusLabel: statusLabel(photoStatus.value),
    hint: "Загрузите фото пользователя, система в скоро времени проведет автоматическую ферификацию!",
    comment: photoComment.value,
    icon: photoStatus.value === "approved" ? UiIconSuccess : photoStatus.value === "rejected" ? UiIconFailed : UiIconWarning,
    state: statusState(photoStatus.value),
  },
  {
    key: "profile",
    title: "Дані користувача",
    status: infoStatus.value,
    statusText: statusTextByKey("profile", infoStatus.value),
    statusLabel: statusLabel(infoStatus.value),
    hint: "Заповніть персональні дані в профілі — після цього система автоматично продовжить верифікацію.",
    comment: infoComment.value,
    icon: infoStatus.value === "approved" ? UiIconSuccess : infoStatus.value === "rejected" ? UiIconFailed : UiIconWarning,
    state: statusState(infoStatus.value),
  },
  {
    key: "email",
    title: "Верифікація пошти",
    status: emailStatus.value,
    statusText: statusTextByKey("email", emailStatus.value),
    statusLabel: statusLabel(emailStatus.value),
    hint: "Підтвердіть email через лист — інколи він потрапляє в «Спам» або «Промоакції».",
    comment: emailComment.value,
    icon: emailStatus.value === "approved" ? UiIconSuccess : emailStatus.value === "rejected" ? UiIconFailed : UiIconWarning,
    state: statusState(emailStatus.value),
  },
  {
    key: "docs",
    title: "Документи",
    status: documentsStatus.value,
    statusText: statusTextByKey("docs", documentsStatus.value),
    statusLabel: statusLabel(documentsStatus.value),
    hint: "",
    comment: documentsComment.value,
    icon: documentsStatus.value === "approved" ? UiIconSuccess : documentsStatus.value === "rejected" ? UiIconFailed : UiIconWarning,
    state: statusState(documentsStatus.value),
  },
  {
    key: "deposit",
    title: "1-й депозит",
    status: depositStatus.value,
    statusText: statusTextByKey("deposit", depositStatus.value),
    statusLabel: statusLabel(depositStatus.value),
    hint: "Зробіть перший депозит — після зарахування система автоматично оновить статус.",
    comment: depositComment.value,
    icon: depositStatus.value === "approved" ? UiIconSuccess : depositStatus.value === "rejected" ? UiIconFailed : UiIconWarning,
    state: statusState(depositStatus.value),
  },
]);

const badgeState = (state: "warn" | "error" | "success") => {
  if (state === "success") return "success";
  if (state === "error") return "danger";
  return "warning";
};

const lineKey = (stepKey: string, field: "status" | "comment" | "hint") => `${stepKey}:${field}`;

const setLineRef = (key: string, el: HTMLElement | null) => {
  lineRefs.value[key] = el;
};

const isExpanded = (key: string) => Boolean(expandedLines[key]);

const recalculateOverflow = () => {
  nextTick(() => {
    Object.entries(lineRefs.value).forEach(([key, el]) => {
      if (!el) {
        overflowLines[key] = false;
        return;
      }

      overflowLines[key] = el.scrollWidth > el.clientWidth + 1;
    });
  });
};

const showArrow = (key: string) => !isExpanded(key) && Boolean(overflowLines[key]);

const expandLine = (key: string) => {
  expandedLines[key] = true;
  recalculateOverflow();
};

const handleWindowResize = () => recalculateOverflow();

const loadVerificationData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const response = await appCore.verifications.get();
    Object.assign(verificationRequestData, response.data.data);

    emailStatus.value = verificationRequestData["email"]?.["verification_status"] ?? emailStatus.value;
    photoStatus.value = verificationRequestData["photo"]?.["verification_status"] ?? photoStatus.value;
    infoStatus.value = verificationRequestData["info"]?.["verification_status"] ?? infoStatus.value;
    documentsStatus.value = verificationRequestData["documents"]?.["verification_status"] ?? documentsStatus.value;
    depositStatus.value = verificationRequestData["deposit"]?.["verification_status"] ?? depositStatus.value;

    emailComment.value = verificationRequestData["email"]?.["comment"] ?? "";
    photoComment.value = verificationRequestData["photo"]?.["comment"] ?? "";
    infoComment.value = verificationRequestData["info"]?.["comment"] ?? "";
    documentsComment.value = verificationRequestData["documents"]?.["comment"] ?? "";
    depositComment.value = verificationRequestData["deposit"]?.["comment"] ?? "";
  } finally {
    setTimeout(() => (isLoading.value = false), 250);
  }
};

onMounted(async () => {
  await loadVerificationData();
  recalculateOverflow();
  window.addEventListener("resize", handleWindowResize);
  useEventBus.on("dashboardRefresh", handleDashboardRefresh);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowResize);
  useEventBus.off("dashboardRefresh", handleDashboardRefresh);
});

watch(
  verificationSteps,
  () => {
    if (!isLoading.value) {
      recalculateOverflow();
    }
  },
  { deep: true },
);
</script>

<style scoped>
.verification-widget {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-side-widget {
  --dashboard-side-widget-height: clamp(360px, 43vh, 440px);
  min-height: var(--dashboard-side-widget-height);
  height: var(--dashboard-side-widget-height);
}

.verification-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-stroke-ui-light);
  border-radius: 12px;
  background:
    linear-gradient(110deg, rgba(18, 179, 126, 0.14) 0%, transparent 45%),
    var(--ui-background-panel);
  padding: 10px 12px;
}

.verification-hero__titles {
  min-width: 0;
}

.verification-hero__title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.1;
}

.verification-hero__subtitle {
  margin-top: 4px;
  color: var(--ui-text-secondary);
  font-size: 12px;
  line-height: 1.2;
}

.verification-profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-shrink: 0;
}

.verification-profile__meta {
  min-width: 0;
  text-align: right;
}

.verification-profile__name {
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.verification-profile__email {
  margin-top: 2px;
  color: var(--ui-text-secondary);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.verification-list-wrap {
  min-height: 0;
  flex: 1;
}

.verification-list {
  height: 100%;
  display: grid;
  gap: 8px;
  align-content: start;
  overflow-y: auto;
  padding-right: 4px;
}

.verification-item {
  border-radius: 12px;
  background: var(--ui-background-panel);
  border: 1px solid var(--color-stroke-ui-light);
  padding: 10px 12px;
  min-height: 68px;
  transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.verification-item__row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.verification-item:hover {
  background: var(--ui-background-card);
  border-color: var(--color-stroke-ui-light);
}

.verification-item--skeleton {
  pointer-events: none;
}

.step-icon {
  height: 32px;
  width: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--ui-background-card);
}

.step-icon.warn {
  color: var(--color-ui-warning);
}

.step-icon.error {
  color: var(--color-danger);
}

.step-icon.success {
  color: var(--color-success);
}

.verification-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.verification-item__title {
  min-width: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--ui-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verification-item__badge {
  flex-shrink: 0;
}

.verification-text-line {
  display: inline-block;
  max-width: 100%;
  font-size: 12px;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verification-text-line.is-expanded {
  white-space: normal;
  overflow: visible;
}

.verification-text-line.is-accent {
  color: var(--ui-primary-accent);
}

.verification-text-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.verification-expand-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--ui-text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
}

.verification-expand-icon:hover {
  color: var(--ui-text-main);
}

@media (max-width: 1023px) {
  .dashboard-side-widget {
    min-height: 0;
    height: auto;
  }

  .verification-list {
    height: auto;
    overflow: visible;
    padding-right: 0;
  }

  .verification-profile__name,
  .verification-profile__email {
    max-width: 122px;
  }
}
</style>
