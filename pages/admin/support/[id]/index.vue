<template>
  <UiContainer>
    <div>
      <div class="mb-5 flex items-center justify-between">
        <div class="flex justify-start items-center gap-2">
          <UiTextH4 class="text-[var(--ui-text-main)]">Support ticket:</UiTextH4>
          <span class="flex justify-start items-center gap-2">
            <UiIconCopy :text="id"/>
            <span class="block truncate">{{ id }}</span>
          </span>
        </div>
      </div>

      <div class="grid gap-[20px] grid-cols-[1fr_2fr]">
        <PanelDefault class="text-[var(--ui-text-main)]">
          <div class="flex items-center gap-2 min-w-0 p-2 m-2 bg-[var(--color-stroke-ui-light)] hover:bg-[var(--color-stroke-ui-dark)] rounded-lg">
            <span class="shrink-0">Status :</span>
            <span class="flex items-center gap-2 min-w-0">
              <UiBadge :outline="true" state="info" class="whitespace-nowrap !p-[14px]">{{ status }}</UiBadge>
            </span>
          </div>

          <div class="flex items-center gap-2 min-w-0 p-2 m-2 bg-[var(--color-stroke-ui-light)] hover:bg-[var(--color-stroke-ui-dark)] rounded-lg">
            <span class="shrink-0">Subject :</span>
            <span class="flex items-center gap-2 min-w-0">
              {{ subject }}
            </span>
          </div>
        </PanelDefault>

        <ChatDefault
          :as-block="true"
          :admin-chat="true"
          :ticket-id="id"
          :currentUser="currentUser"
          class="w-full h-[70vh] md:h-[540px] rounded-2xl border border-[var(--ui-primary-main)] dark:border-slate-700 bg-[var(--ui-background)] shadow-2xl overflow-hidden"
        />
      </div>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import UiTextH4 from "~/components/ui/UiTextH4.vue";
import UiIconCopy from "~/components/ui/UiIconCopy.vue";
import UiBadge from "~/components/ui/UiBadge.vue";
import ChatDefault from "~/components/block/chats/ChatDefault.vue";

import useAppCore from "~/composables/useAppCore";
import {definePageMeta} from "~/.nuxt/imports";
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";

definePageMeta({layout: "default", middleware: ["auth-client", "client-check-auth"]});

const route = useRoute();
const appCore = useAppCore();

const id = computed(() => String(route.params.id));
const status = ref("");
const subject = ref("");

const currentUser = reactive({
  id: null,
  name: null,
});

const loadData = async () => {
  const response = await appCore.adminModules.tickets.getById(route.params.id);
  status.value = response.data.status;
  subject.value = response.data.subject;
};

onMounted(async () => {
  const response = await appCore.adminModules.auth.getAuthUser();
  currentUser.id = response.data.id;
  currentUser.name = response.data.nickname;

  await loadData();
});
</script>
