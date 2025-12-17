<template>

  <UiContainer>
    <div class="text-[var(--ui-text-main)]">
      <div class="mb-5 flex items-center justify-between">
        <div class="flex justify-start items-center gap-2">
          <UiTextH4 class="text-[var(--ui-text-main)]">
            {{ t("cabinet.accounts.account.title") }} :
          </UiTextH4>

          <span class="flex justify-start items-center gap-2">
            <UiIconCopy :text="id"/>
            <span class="block truncate">{{ id }}</span>
          </span>
        </div>
      </div>

      <div class="grid gap-[20px] grid-cols-[1fr_2fr]">
        <PanelDefault class="text-[var(--ui-text-main)]">
          <div class="flex flex-col gap-4">
            <div class="rounded-xl border border-[var(--color-stroke-ui-dark)] bg-[var(--color-stroke-ui-light)]/50 p-4 text-[var(--ui-text-main)]">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 rounded-full bg-[var(--ui-primary-main)]/20 text-[var(--ui-primary-main)] flex items-center justify-center font-semibold">
                  {{ userCard.initials }}
                </div>
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ userCard.name }}</div>
                  <div class="text-xs text-[var(--ui-text-secondary)] truncate">{{ userCard.email }}</div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--color-stroke-ui-dark)] bg-[var(--ui-background-panel)] p-4 text-[var(--ui-text-main)]">
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm text-[var(--ui-text-secondary)]">Status</div>
                <UiBadge :outline="true" state="info" class="whitespace-nowrap !p-[10px]">{{ status }}</UiBadge>
              </div>
              <div class="mt-3 text-sm">
                <div class="text-[var(--ui-text-secondary)]">Subject</div>
                <div class="mt-1 font-medium">{{ subject }}</div>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--color-stroke-ui-dark)] bg-[var(--ui-background-panel)] p-4 text-[var(--ui-text-main)]">
              <div class="flex items-center justify-between">
                <div class="font-semibold">Participants</div>
                <span class="text-xs text-[var(--ui-text-secondary)]">{{ participants.length }} people</span>
              </div>
              <div class="mt-3 flex flex-col gap-2">
                <div
                  v-for="person in participants"
                  :key="person.id"
                  class="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-stroke-ui-dark)] px-3 py-2"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="h-8 w-8 rounded-full bg-[var(--color-stroke-ui-dark)] text-xs font-semibold flex items-center justify-center">
                      {{ person.initials }}
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-medium truncate">{{ person.name }}</div>
                      <div class="text-xs text-[var(--ui-text-secondary)]">{{ person.role }}</div>
                    </div>
                  </div>
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="person.online ? 'bg-emerald-400' : 'bg-[var(--ui-text-secondary)]'"
                    :title="person.online ? 'Online' : 'Offline'"
                  />
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--color-stroke-ui-dark)] bg-[var(--ui-background-panel)] p-4 text-[var(--ui-text-main)]">
              <div class="flex items-center gap-2 text-sm">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  type="button"
                  class="rounded-lg border px-3 py-1.5 transition"
                  :class="activeTab === tab.id ? 'border-[var(--ui-primary-main)] bg-[var(--ui-primary-main)] text-white' : 'border-[var(--color-stroke-ui-light)] text-[var(--ui-text-main)] hover:bg-[var(--color-stroke-ui-dark)]'"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div class="mt-4">
                <div v-if="activeTab === 'media'" class="grid grid-cols-3 gap-2">
                  <div
                    v-for="media in mediaItems"
                    :key="media.id"
                    class="aspect-square rounded-lg bg-[var(--color-stroke-ui-dark)]/80 border border-[var(--color-stroke-ui-light)] flex items-center justify-center text-xs text-[var(--ui-text-secondary)]"
                  >
                    {{ media.label }}
                  </div>
                </div>

                <div v-else-if="activeTab === 'videos'" class="grid grid-cols-2 gap-2">
                  <div
                    v-for="video in videoItems"
                    :key="video.id"
                    class="rounded-lg border border-[var(--color-stroke-ui-light)] bg-[var(--color-stroke-ui-dark)]/70 p-3"
                  >
                    <div class="text-xs text-[var(--ui-text-secondary)]">Video</div>
                    <div class="mt-1 font-medium text-sm truncate">{{ video.title }}</div>
                    <div class="mt-2 text-xs text-[var(--ui-text-secondary)]">{{ video.duration }}</div>
                  </div>
                </div>

                <div v-else class="flex flex-col gap-2">
                  <a
                    v-for="link in linkItems"
                    :key="link.id"
                    href="#"
                  class="rounded-lg border border-[var(--color-stroke-ui-light)] bg-[var(--color-stroke-ui-dark)]/40 px-3 py-2 text-sm text-[var(--ui-text-main)] hover:bg-[var(--color-stroke-ui-dark)]"
                >
                    <div class="font-medium truncate">{{ link.title }}</div>
                    <div class="text-xs text-[var(--ui-text-secondary)] truncate">{{ link.url }}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </PanelDefault>

        <ChatDefault
            :as-block="true"
            :ticket-id="id"
            :currentUser="currentUser"
            class="w-full h-[70vh] md:h-[540px] rounded-2xl border border-[var(--ui-primary-main)] dark:border-slate-700 bg-[var(--ui-background)] overflow-hidden"
        />
      </div>

    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import UiTextH4 from "~/components/ui/UiTextH4.vue";

import useAppCore from "~/composables/useAppCore";
import {definePageMeta} from "~/.nuxt/imports";
import {useI18n} from "vue-i18n";
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import ChatDefault from "~/components/block/chats/ChatDefault.vue";
import UiIconCopy from "~/components/ui/UiIconCopy.vue";
import UiBadge from "~/components/ui/UiBadge.vue";

definePageMeta({layout: "cabinet", middleware: ["auth-client", "client-check-auth"]});

const {t} = useI18n({useScope: "global"});

const route = useRoute();

const appCore = useAppCore();

const activeTabIndex = ref(0);
const isLoading = ref(false);

const id: string = computed(() => String(route.params.id));

const currentUser = reactive({
  id: null,
  name: null,
})

const lastMessageAt = ref('');
const status = ref('');
const subject = ref('');
const activeTab = ref<"media" | "videos" | "links">("media");
const userCard = reactive({
  name: "Ester Holdings Client",
  email: "client@esterholdings.com",
  initials: "EH",
});
const participants = reactive([
  { id: 1, name: "You", role: "Client", initials: "YC", online: true },
  { id: 2, name: "Support Agent", role: "Support", initials: "SA", online: true },
]);
const tabs = [
  { id: "media", label: "Media" },
  { id: "videos", label: "Video" },
  { id: "links", label: "Links" },
];
const mediaItems = [
  { id: 1, label: "Photo" },
  { id: 2, label: "Photo" },
  { id: 3, label: "Photo" },
  { id: 4, label: "Photo" },
  { id: 5, label: "Photo" },
  { id: 6, label: "Photo" },
];
const videoItems = [
  { id: 1, title: "Screen recording", duration: "02:14" },
  { id: 2, title: "Issue reproduction", duration: "00:46" },
];
const linkItems = [
  { id: 1, title: "Trading Platform Docs", url: "https://esterholdings.com/docs" },
  { id: 2, title: "Account Verification", url: "https://esterholdings.com/verify" },
  { id: 3, title: "Support Center", url: "https://esterholdings.com/support" },
];

const loadData = async () => {
  console.log('run run run run run');
  isLoading.value = true;

  const response = await appCore.tickets.getById(route.params.id);

  console.log('response');
  console.log(response.data);

  lastMessageAt.value = response.data.last_message_at;
  status.value = response.data.status;
  subject.value = response.data.subject;

  isLoading.value = false;
}

onMounted(async () => {
  const response = await appCore.auth.getAuthUser();
  currentUser.id = response.data.id;
  currentUser.name = response.data.first_name;
  userCard.name = response.data.first_name || userCard.name;
  if (response.data.email) userCard.email = response.data.email;
  if (response.data.first_name && response.data.last_name) {
    userCard.initials = `${response.data.first_name[0]}${response.data.last_name[0]}`.toUpperCase();
  }

  await loadData()
})
</script>

<style lang="scss" scoped>
.icon-update {
  height: 14px;
  width: 14px;
  margin-right: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    animation: wiggle 0.2s ease;
  }
}

.icon-update.spinning {
  animation: spin 0.5s linear;
}

.balance-sum {
  cursor: pointer;
}

.wiggle:hover {
  animation: wiggle 0.3s ease;
}

/* ========== KEYFRAMES ========== */

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes wiggle {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}

.accounts {
  &__title {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
      color: var(--ui-text-main);
    }
  }

  &__content {

  }
}
</style>
